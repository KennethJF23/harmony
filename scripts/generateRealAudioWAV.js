#!/usr/bin/env node

/**
 * Generate REAL playable audio files for Harmony app
 * Creates valid WAV files with actual audio (binaural beats and noise)
 * NO EXTERNAL DEPENDENCIES - Pure Node.js!
 */

const fs = require('fs');
const path = require('path');

// WAV file header generator
function createWavHeader(dataSize, sampleRate = 44100, numChannels = 2, bitsPerSample = 16) {
    const buffer = Buffer.alloc(44);
    
    // RIFF chunk descriptor
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    
    // fmt sub-chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Sub-chunk size
    buffer.writeUInt16LE(1, 20); // Audio format (PCM)
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28); // Byte rate
    buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32); // Block align
    buffer.writeUInt16LE(bitsPerSample, 34);
    
    // data sub-chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);
    
    return buffer;
}

// Generate binaural beat (stereo with different frequencies)
function generateBinauralBeat(freq1, freq2, duration = 60, sampleRate = 44100, volume = 0.3) {
    const numSamples = sampleRate * duration;
    const buffer = Buffer.alloc(numSamples * 4); // 2 channels * 2 bytes per sample
    
    for (let i = 0; i < numSamples; i++) {
        // Left channel: freq1
        const sampleL = Math.sin(2 * Math.PI * freq1 * i / sampleRate) * volume;
        const valueL = Math.floor(sampleL * 32767);
        
        // Right channel: freq2
        const sampleR = Math.sin(2 * Math.PI * freq2 * i / sampleRate) * volume;
        const valueR = Math.floor(sampleR * 32767);
        
        // Write interleaved stereo samples
        buffer.writeInt16LE(valueL, i * 4);
        buffer.writeInt16LE(valueR, i * 4 + 2);
    }
    
    return buffer;
}

// Generate white noise
function generateNoise(duration = 60, sampleRate = 44100, volume = 0.15) {
    const numSamples = sampleRate * duration;
    const buffer = Buffer.alloc(numSamples * 4); // 2 channels * 2 bytes per sample
    
    for (let i = 0; i < numSamples; i++) {
        // Generate random noise for both channels
        const noise = (Math.random() * 2 - 1) * volume;
        const value = Math.floor(noise * 32767);
        
        buffer.writeInt16LE(value, i * 4);     // Left
        buffer.writeInt16LE(value, i * 4 + 2); // Right
    }
    
    return buffer;
}

// Generate pink noise (more natural sounding)
function generatePinkNoise(duration = 60, sampleRate = 44100, volume = 0.15) {
    const numSamples = sampleRate * duration;
    const buffer = Buffer.alloc(numSamples * 4);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < numSamples; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11 * volume;
        b6 = white * 0.115926;
        
        const value = Math.floor(pink * 32767);
        buffer.writeInt16LE(value, i * 4);     // Left
        buffer.writeInt16LE(value, i * 4 + 2); // Right
    }
    
    return buffer;
}

// Create WAV file
function createWavFile(filepath, audioData, sampleRate = 44100) {
    const header = createWavHeader(audioData.length, sampleRate);
    const wavFile = Buffer.concat([header, audioData]);
    fs.writeFileSync(filepath, wavFile);
}

// Main generation function
function main() {
    console.log('🎵 Harmony Audio File Generator (Pure Node.js)\n');
    console.log('🎧 Generating REAL audio files with actual sound!\n');
    
    const baseDir = path.join(__dirname, '..', 'public', 'audio');
    
    const audioFiles = {
        focus: [
            { name: 'alpha-focus.wav', type: 'binaural', freq1: 200, freq2: 210, desc: 'Alpha 10Hz binaural beat' },
            { name: 'beta-focus.wav', type: 'binaural', freq1: 200, freq2: 220, desc: 'Beta 20Hz binaural beat' },
            { name: 'gamma-focus.wav', type: 'binaural', freq1: 200, freq2: 240, desc: 'Gamma 40Hz binaural beat' },
        ],
        relax: [
            { name: 'theta-relax.wav', type: 'binaural', freq1: 200, freq2: 206, desc: 'Theta 6Hz binaural beat' },
            { name: 'alpha-calm.wav', type: 'binaural', freq1: 200, freq2: 210, desc: 'Alpha 10Hz binaural beat' },
        ],
        deep: [
            { name: 'deep-focus.wav', type: 'binaural', freq1: 200, freq2: 215, desc: 'Deep focus 15Hz' },
            { name: 'study-wave.wav', type: 'binaural', freq1: 200, freq2: 218, desc: 'Study 18Hz binaural beat' },
        ],
        ambient: [
            { name: 'rain.wav', type: 'pink', desc: 'Pink noise (rain ambience)' },
            { name: 'ocean.wav', type: 'pink', desc: 'Pink noise (ocean waves)' },
            { name: 'wind.wav', type: 'white', desc: 'White noise (wind)' },
            { name: 'whistle.wav', type: 'tone', freq1: 440, freq2: 440, desc: '440Hz tone' },
            { name: 'white-noise.wav', type: 'white', desc: 'White noise' },
            { name: 'forest.wav', type: 'pink', desc: 'Pink noise (forest)' },
            { name: 'nature.wav', type: 'white', desc: 'White noise (nature)' },
        ]
    };
    
    let total = 0;
    Object.values(audioFiles).forEach(files => total += files.length);
    
    let current = 0;
    
    console.log(`📦 Generating ${total} audio files...\n`);
    
    for (const [category, files] of Object.entries(audioFiles)) {
        const categoryPath = path.join(baseDir, category);
        console.log(`\n📁 ${category}/`);
        
        for (const file of files) {
            current++;
            const filepath = path.join(categoryPath, file.name);
            
            process.stdout.write(`  [${current}/${total}] ${file.name}... `);
            
            try {
                let audioData;
                
                switch (file.type) {
                    case 'binaural':
                        audioData = generateBinauralBeat(file.freq1, file.freq2);
                        break;
                    case 'white':
                        audioData = generateNoise();
                        break;
                    case 'pink':
                        audioData = generatePinkNoise();
                        break;
                    case 'tone':
                        audioData = generateBinauralBeat(file.freq1, file.freq2);
                        break;
                    default:
                        audioData = generateNoise();
                }
                
                createWavFile(filepath, audioData);
                
                const sizeKB = (fs.statSync(filepath).size / 1024).toFixed(1);
                console.log(`✅ (${sizeKB} KB) - ${file.desc}`);
                
            } catch (error) {
                console.log(`❌ Error: ${error.message}`);
            }
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n✨ Audio generation complete!`);
    console.log(`   📊 Created: ${current} WAV files`);
    console.log(`   📁 Location: ${baseDir}`);
    console.log(`\n🎧 These files contain REAL AUDIO!`);
    console.log(`   • Binaural beats: You WILL hear tones in each ear`);
    console.log(`   • Ambient sounds: You WILL hear noise`);
    console.log(`   • Put on headphones and test!`);
    console.log(`\n⚠️  Note: WAV files are larger than MP3`);
    console.log(`   For production, convert to MP3 or use professional audio`);
    console.log(`\n📚 Next steps:`);
    console.log(`   1. Update audioLoader.ts to use .wav extension`);
    console.log(`   2. Start dev server: npm run dev`);
    console.log(`   3. Go to http://localhost:3000/player`);
    console.log(`   4. PUT ON HEADPHONES and test!`);
    console.log(``);
}

try {
    main();
    process.exit(0);
} catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
}
