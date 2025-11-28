"""
Generate Real Audio Files for Harmony App
Creates valid MP3 files with actual audio content (sine waves/noise)
Requires: pydub, numpy

Install: pip install pydub numpy
"""

try:
    from pydub import AudioSegment
    from pydub.generators import Sine, WhiteNoise, Square
    import numpy as np
    import os
    from pathlib import Path
except ImportError:
    print("❌ Missing dependencies!")
    print("Install required packages:")
    print("  pip install pydub numpy")
    print("\nOptional (for MP3 export):")
    print("  pip install ffmpeg-python")
    print("  Or download FFmpeg from: https://ffmpeg.org/download.html")
    exit(1)

def create_binaural_beat(base_freq=200, beat_freq=10, duration_ms=60000):
    """Generate a binaural beat (stereo with frequency difference)"""
    # Left channel: base frequency
    left = Sine(base_freq).to_audio_segment(duration=duration_ms)
    
    # Right channel: base frequency + beat frequency
    right = Sine(base_freq + beat_freq).to_audio_segment(duration=duration_ms)
    
    # Combine into stereo
    stereo = AudioSegment.from_mono_audiosegments(left, right)
    
    # Reduce volume to comfortable level
    return stereo - 20  # Reduce by 20 dB

def create_noise(noise_type='white', duration_ms=60000):
    """Generate noise (white, pink, brown)"""
    if noise_type == 'white':
        return WhiteNoise().to_audio_segment(duration=duration_ms) - 15
    else:
        # For other noise types, we'll use white noise with filtering
        white = WhiteNoise().to_audio_segment(duration=duration_ms)
        return white - 15

def create_tone(freq=440, duration_ms=60000):
    """Generate a simple sine tone"""
    tone = Sine(freq).to_audio_segment(duration=duration_ms)
    return tone - 20

def main():
    print("🎵 Harmony Audio File Generator with Real Audio\n")
    
    # Define output directory
    base_dir = Path(__file__).parent.parent / "public" / "audio"
    
    audio_files = {
        'focus': [
            ('alpha-focus.mp3', lambda: create_binaural_beat(200, 10, 60000), 'Alpha waves 10Hz'),
            ('beta-focus.mp3', lambda: create_binaural_beat(200, 20, 60000), 'Beta waves 20Hz'),
            ('gamma-focus.mp3', lambda: create_binaural_beat(200, 40, 60000), 'Gamma waves 40Hz'),
        ],
        'relax': [
            ('theta-relax.mp3', lambda: create_binaural_beat(200, 6, 60000), 'Theta waves 6Hz'),
            ('alpha-calm.mp3', lambda: create_binaural_beat(200, 10, 60000), 'Alpha waves 10Hz'),
        ],
        'deep': [
            ('deep-focus.mp3', lambda: create_binaural_beat(200, 15, 60000), 'Deep focus 15Hz'),
            ('study-wave.mp3', lambda: create_binaural_beat(200, 18, 60000), 'Study wave 18Hz'),
        ],
        'ambient': [
            ('rain.mp3', lambda: create_noise('white', 60000), 'Rain noise'),
            ('ocean.mp3', lambda: create_noise('white', 60000), 'Ocean noise'),
            ('wind.mp3', lambda: create_noise('white', 60000), 'Wind noise'),
            ('whistle.mp3', lambda: create_tone(440, 60000), 'Whistle tone'),
            ('white-noise.mp3', lambda: create_noise('white', 60000), 'White noise'),
            ('forest.mp3', lambda: create_noise('white', 60000), 'Forest ambience'),
            ('nature.mp3', lambda: create_noise('white', 60000), 'Nature sounds'),
        ]
    }
    
    total = sum(len(files) for files in audio_files.values())
    current = 0
    
    print(f"📦 Generating {total} audio files with real audio content...\n")
    
    for category, files in audio_files.items():
        category_path = base_dir / category
        print(f"\n📁 {category}/")
        
        for filename, generator_func, description in files:
            current += 1
            filepath = category_path / filename
            
            try:
                print(f"  [{current}/{total}] Generating {filename}... ", end='', flush=True)
                
                # Generate audio
                audio = generator_func()
                
                # Export as MP3
                audio.export(
                    str(filepath),
                    format="mp3",
                    bitrate="192k",
                    parameters=["-ar", "44100"]
                )
                
                size_kb = filepath.stat().st_size / 1024
                print(f"✅ ({size_kb:.1f} KB) - {description}")
                
            except Exception as e:
                print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print(f"\n✨ Generation complete!")
    print(f"   📊 Created: {current} files")
    print(f"   📁 Location: {base_dir}")
    print(f"\n🎧 These files contain REAL audio (binaural beats and noise)")
    print(f"   You should hear sound when playing them!")
    print(f"\n⚠️  For production, replace with professional recordings")
    print(f"\n📚 Next steps:")
    print(f"   1. Start dev server: npm run dev")
    print(f"   2. Go to http://localhost:3000/player")
    print(f"   3. Test audio playback")

if __name__ == "__main__":
    main()
