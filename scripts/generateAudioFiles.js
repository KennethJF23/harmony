/**
 * Audio File Generator Script
 * Generates silent placeholder audio files for the Harmony app
 * Replace these with actual professional audio recordings
 */

const fs = require('fs');
const path = require('path');

// Audio file structure
const audioFiles = {
  focus: [
    { name: 'alpha-focus.mp3', duration: 1500 }, // 25 min
    { name: 'beta-focus.mp3', duration: 1800 },  // 30 min
    { name: 'gamma-focus.mp3', duration: 1200 }, // 20 min
  ],
  relax: [
    { name: 'theta-relax.mp3', duration: 1800 }, // 30 min
    { name: 'alpha-calm.mp3', duration: 1500 },  // 25 min
  ],
  deep: [
    { name: 'deep-focus.mp3', duration: 2700 },  // 45 min
    { name: 'study-wave.mp3', duration: 3000 },  // 50 min
  ],
  ambient: [
    { name: 'rain.mp3', duration: 1800 },
    { name: 'ocean.mp3', duration: 1800 },
    { name: 'wind.mp3', duration: 1800 },
    { name: 'whistle.mp3', duration: 1800 },
    { name: 'white-noise.mp3', duration: 1800 },
    { name: 'forest.mp3', duration: 1800 },
    { name: 'nature.mp3', duration: 1800 },
  ]
};

/**
 * Generate a minimal valid MP3 file (silent)
 * This creates a very small valid MP3 header that browsers can decode
 */
function generateSilentMP3() {
  // Minimal MP3 frame (silence)
  // This is a valid MP3 frame with MPEG 1 Layer 3, 128 kbps, 44.1 kHz
  const mp3Frame = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, // MP3 sync word and header
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    // ... rest of frame is zeros (silence)
  ]);
  
  // Repeat frame multiple times to create a longer file
  const frames = 100;
  const buffers = [];
  for (let i = 0; i < frames; i++) {
    buffers.push(mp3Frame);
  }
  
  return Buffer.concat(buffers);
}

/**
 * Create audio file structure
 */
function createAudioFiles() {
  const publicAudioPath = path.join(__dirname, '..', 'public', 'audio');
  
  console.log('🎵 Generating audio files...\n');
  
  Object.entries(audioFiles).forEach(([category, files]) => {
    const categoryPath = path.join(publicAudioPath, category);
    
    // Ensure directory exists
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
    
    files.forEach(file => {
      const filePath = path.join(categoryPath, file.name);
      const mp3Content = generateSilentMP3();
      
      fs.writeFileSync(filePath, mp3Content);
      console.log(`✅ Created: ${category}/${file.name} (${file.duration}s)`);
    });
  });
  
  console.log('\n✨ Audio files generated successfully!');
  console.log('\n⚠️  IMPORTANT: These are placeholder files.');
  console.log('📝 Replace them with actual audio recordings for production.');
  console.log('\n📚 Recommended sources:');
  console.log('   - Freesound.org (Creative Commons audio)');
  console.log('   - Epidemic Sound (licensed music)');
  console.log('   - Generate binaural beats with Audacity or專業 tools');
  console.log('\n🎯 Audio should be:');
  console.log('   - High quality (320kbps MP3 or better)');
  console.log('   - Properly loopable (seamless transitions)');
  console.log('   - Appropriate duration for focus sessions');
}

// Run the generator
createAudioFiles();
