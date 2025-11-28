#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Generate real audio files for Harmony app using FFmpeg
.DESCRIPTION
    Creates valid MP3 files with actual audio content (binaural beats and noise)
    Requires FFmpeg to be installed
.NOTES
    Install FFmpeg: winget install ffmpeg
    Or download from: https://ffmpeg.org/download.html
#>

# Check if FFmpeg is installed
try {
    $ffmpegVersion = ffmpeg -version 2>$null
    if (-not $?) {
        throw "FFmpeg not found"
    }
} catch {
    Write-Host "❌ FFmpeg is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install FFmpeg:" -ForegroundColor Yellow
    Write-Host "  Option 1: winget install ffmpeg"
    Write-Host "  Option 2: choco install ffmpeg"
    Write-Host "  Option 3: Download from https://ffmpeg.org/download.html"
    Write-Host ""
    exit 1
}

Write-Host "🎵 Harmony Audio File Generator (FFmpeg)" -ForegroundColor Cyan
Write-Host "⚠️  Generating real audio files with actual sound`n" -ForegroundColor Yellow

$baseDir = Join-Path $PSScriptRoot ".." "public" "audio"

# Audio file definitions
$audioFiles = @{
    'focus' = @(
        @{ name='alpha-focus.mp3'; freq1=200; freq2=210; desc='Alpha 10Hz binaural beat' }
        @{ name='beta-focus.mp3'; freq1=200; freq2=220; desc='Beta 20Hz binaural beat' }
        @{ name='gamma-focus.mp3'; freq1=200; freq2=240; desc='Gamma 40Hz binaural beat' }
    )
    'relax' = @(
        @{ name='theta-relax.mp3'; freq1=200; freq2=206; desc='Theta 6Hz binaural beat' }
        @{ name='alpha-calm.mp3'; freq1=200; freq2=210; desc='Alpha 10Hz binaural beat' }
    )
    'deep' = @(
        @{ name='deep-focus.mp3'; freq1=200; freq2=215; desc='Deep focus 15Hz' }
        @{ name='study-wave.mp3'; freq1=200; freq2=218; desc='Study 18Hz binaural beat' }
    )
    'ambient' = @(
        @{ name='rain.mp3'; type='noise'; desc='Pink noise (rain)' }
        @{ name='ocean.mp3'; type='noise'; desc='Brown noise (ocean)' }
        @{ name='wind.mp3'; type='noise'; desc='White noise (wind)' }
        @{ name='whistle.mp3'; freq1=440; freq2=440; desc='440Hz tone' }
        @{ name='white-noise.mp3'; type='noise'; desc='White noise' }
        @{ name='forest.mp3'; type='noise'; desc='Pink noise (forest)' }
        @{ name='nature.mp3'; type='noise'; desc='White noise (nature)' }
    )
}

$total = ($audioFiles.Values | ForEach-Object { $_.Count }) | Measure-Object -Sum | Select-Object -ExpandProperty Sum
$current = 0

Write-Host "📦 Generating $total audio files with real audio...`n"

foreach ($category in $audioFiles.Keys) {
    $categoryPath = Join-Path $baseDir $category
    Write-Host "`n📁 $category/" -ForegroundColor Green
    
    foreach ($file in $audioFiles[$category]) {
        $current++
        $filepath = Join-Path $categoryPath $file.name
        
        Write-Host "  [$current/$total] Generating $($file.name)... " -NoNewline
        
        try {
            if ($file.type -eq 'noise') {
                # Generate white/pink/brown noise
                $noiseType = 'white'
                if ($file.name -match 'rain|forest|ocean') { $noiseType = 'brown' }
                
                ffmpeg -f lavfi -i "anoisesrc=c=${noiseType}:d=60" `
                    -ar 44100 -ac 2 -b:a 192k `
                    -y "$filepath" 2>$null | Out-Null
            }
            else {
                # Generate binaural beat (stereo sine waves)
                $freq1 = $file.freq1
                $freq2 = $file.freq2
                
                ffmpeg -f lavfi `
                    -i "sine=frequency=${freq1}:duration=60" `
                    -f lavfi `
                    -i "sine=frequency=${freq2}:duration=60" `
                    -filter_complex "[0:a][1:a]join=inputs=2:channel_layout=stereo[a]" `
                    -map "[a]" -ar 44100 -b:a 192k `
                    -y "$filepath" 2>$null | Out-Null
            }
            
            $sizeKB = [math]::Round((Get-Item $filepath).Length / 1KB, 1)
            Write-Host "✅ ($sizeKB KB) - $($file.desc)" -ForegroundColor Green
            
        } catch {
            Write-Host "❌ Error: $_" -ForegroundColor Red
        }
    }
}

Write-Host "`n$('=' * 60)"
Write-Host "`n✨ Generation complete!" -ForegroundColor Green
Write-Host "   📊 Created: $current files"
Write-Host "   📁 Location: $baseDir"
Write-Host "`n🎧 These files contain REAL audio!" -ForegroundColor Cyan
Write-Host "   • Binaural beats: Different frequency in each ear"
Write-Host "   • Ambient sounds: Actual noise generation"
Write-Host "   • You WILL hear sound when playing them!"
Write-Host "`n⚠️  For production, replace with professional recordings" -ForegroundColor Yellow
Write-Host "`n📚 Next steps:"
Write-Host "   1. Start dev server: npm run dev"
Write-Host "   2. Go to http://localhost:3000/player"
Write-Host "   3. Put on headphones and test!"
Write-Host ""
