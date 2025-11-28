#!/usr/bin/env node

/**
 * Audio File Generator for Harmony App
 * Creates minimal valid MP3 files that can be decoded by browsers
 * These serve as placeholders - replace with professional recordings for production
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 Harmony Audio File Generator\n');
console.log('⚠️  Creating placeholder audio files for development');
console.log('📝 Replace these with professional recordings for production!\n');

// Audio file catalog
const audioFiles = {
  focus: [
    { name: 'alpha-focus.mp3', desc: 'Alpha Focus Wave (8-12 Hz)', duration: 1500 },
    { name: 'beta-focus.mp3', desc: 'Beta Focus Wave (13-30 Hz)', duration: 1800 },
    { name: 'gamma-focus.mp3', desc: 'Gamma Focus Wave (30-100 Hz)', duration: 1200 },
  ],
  relax: [
    { name: 'theta-relax.mp3', desc: 'Theta Relaxation (4-8 Hz)', duration: 1800 },
    { name: 'alpha-calm.mp3', desc: 'Alpha Calm Wave', duration: 1500 },
  ],
  deep: [
    { name: 'deep-focus.mp3', desc: 'Deep Focus Session', duration: 2700 },
    { name: 'study-wave.mp3', desc: 'Study Wave', duration: 3000 },
  ],
  ambient: [
    { name: 'rain.mp3', desc: 'Rain Ambience', duration: 1800 },
    { name: 'ocean.mp3', desc: 'Ocean Waves', duration: 1800 },
    { name: 'wind.mp3', desc: 'Wind Sounds', duration: 1800 },
    { name: 'whistle.mp3', desc: 'Whistle Melody', duration: 1800 },
    { name: 'white-noise.mp3', desc: 'White Noise', duration: 1800 },
    { name: 'forest.mp3', desc: 'Forest Ambience', duration: 1800 },
    { name: 'nature.mp3', desc: 'Nature Sounds', duration: 1800 },
  ]
};

/**
 * Generate a minimal valid MP3 file
 * This creates a valid MP3 header followed by silent frames
 */
function generateMinimalMP3() {
  // MP3 Frame Header for MPEG-1 Layer 3, 128 kbps, 44.1 kHz, Stereo
  // Sync word (11 bits): 0xFFE
  // MPEG version (2 bits): 11 (MPEG-1)
  // Layer (2 bits): 01 (Layer 3)
  // Protection bit (1 bit): 1 (no CRC)
  // Bitrate index (4 bits): 1001 (128 kbps)
  // Sample rate (2 bits): 00 (44.1 kHz)
  // Padding bit (1 bit): 0
  // Private bit (1 bit): 0
  // Channel mode (2 bits): 00 (stereo)
  // Mode extension (2 bits): 00
  // Copyright (1 bit): 0
  // Original (1 bit): 0
  // Emphasis (2 bits): 00
  
  const frames = [];
  const frameCount = 50; // Generate 50 frames (~1.3 seconds)
  
  for (let i = 0; i < frameCount; i++) {
    // MP3 frame header (4 bytes)
    const header = Buffer.from([
      0xFF, // Sync word (8 bits) + MPEG/Layer bits
      0xFB, // MPEG-1, Layer 3, no CRC
      0x90, // 128 kbps, 44.1 kHz
      0x00  // Stereo, no padding
    ]);
    
    // Frame data (417 bytes for 128kbps @44.1kHz)
    // We'll fill with zeros (silence) and some minimal side info
    const frameSize = 417;
    const frameData = Buffer.alloc(frameSize);
    
    // Minimal MP3 side information (required for valid decode)
    // This is a simplified version - just enough to be valid
    frameData[0] = 0x00; // Main data begin
    frameData[1] = 0x00;
    frameData[2] = 0x00; // Private bits
    frameData[3] = 0x00;
    
    // Rest is zeros (silence)
    const frame = Buffer.concat([header, frameData]);
    frames.push(frame);
  }
  
  // Add ID3v2 tag at the beginning (optional but makes it more complete)
  const id3Tag = Buffer.from([
    0x49, 0x44, 0x33, // "ID3"
    0x03, 0x00,       // Version 2.3.0
    0x00,             // Flags
    0x00, 0x00, 0x00, 0x00 // Size (0 - no tag data)
  ]);
  
  return Buffer.concat([id3Tag, ...frames]);
}

/**
 * Create audio file structure
 */
function createAudioFiles() {
  const publicAudioPath = path.join(__dirname, '..', 'public', 'audio');
  
  let totalFiles = 0;
  let createdFiles = 0;
  let skippedFiles = 0;
  
  // Count total files
  Object.values(audioFiles).forEach(files => {
    totalFiles += files.length;
  });
  
  console.log(`📦 Generating ${totalFiles} audio files...\n`);
  
  Object.entries(audioFiles).forEach(([category, files]) => {
    const categoryPath = path.join(publicAudioPath, category);
    
    // Ensure directory exists
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`📁 Created directory: audio/${category}/`);
    }
    
    files.forEach(file => {
      const filePath = path.join(categoryPath, file.name);
      
      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  Skipped: ${category}/${file.name} (already exists)`);
        skippedFiles++;
        return;
      }
      
      // Generate and write MP3 content
      const mp3Content = generateMinimalMP3();
      fs.writeFileSync(filePath, mp3Content);
      
      createdFiles++;
      const sizeKB = (mp3Content.length / 1024).toFixed(1);
      console.log(`✅ Created: ${category}/${file.name} (${sizeKB} KB) - ${file.desc}`);
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Generation complete!`);
  console.log(`   📊 Created: ${createdFiles} files`);
  console.log(`   ⏭️  Skipped: ${skippedFiles} files (already existed)`);
  console.log(`   📁 Total: ${totalFiles} files\n`);
  
  console.log('⚠️  IMPORTANT NOTES:');
  console.log('   • These are PLACEHOLDER files for development');
  console.log('   • They contain minimal valid MP3 data (mostly silence)');
  console.log('   • Replace with professional audio for production');
  console.log('   • The app also generates binaural beats in real-time\n');
  
  console.log('📚 Recommended next steps:');
  console.log('   1. Test the audio player: npm run dev');
  console.log('   2. Navigate to http://localhost:3000/player');
  console.log('   3. Verify all tracks load and play');
  console.log('   4. Replace placeholders with real audio\n');
  
  console.log('🎯 Audio sources:');
  console.log('   • Freesound.org (Creative Commons)');
  console.log('   • Bensound.com (Royalty-free)');
  console.log('   • Generate with Audacity (free)');
  console.log('   • See AUDIO_SYSTEM_SETUP.md for details\n');
}

// Run the generator
try {
  createAudioFiles();
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
