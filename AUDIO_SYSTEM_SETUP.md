# 🎵 Audio System Documentation - Harmony App

## 🔧 Current Status

**✅ Audio Engine:** Fully functional Web Audio API implementation
**✅ Player UI:** Complete with controls, visualizer, and playlist
**❌ Audio Files:** Missing - need to be generated/added

## 📁 Audio File Structure

```
public/audio/
├── focus/
│   ├── alpha-focus.mp3    (25 min) - Enhanced concentration, 8-12 Hz
│   ├── beta-focus.mp3     (30 min) - Active thinking, 13-30 Hz
│   └── gamma-focus.mp3    (20 min) - Peak performance, 30-100 Hz
├── relax/
│   ├── theta-relax.mp3    (30 min) - Deep relaxation, 4-8 Hz
│   └── alpha-calm.mp3     (25 min) - Peaceful state, 8-12 Hz
├── deep/
│   ├── deep-focus.mp3     (45 min) - Prolonged concentration
│   └── study-wave.mp3     (50 min) - Learning enhancement
└── ambient/
    ├── rain.mp3           (30 min) - Gentle rainfall
    ├── ocean.mp3          (30 min) - Ocean waves
    ├── wind.mp3           (30 min) - Soft wind
    ├── whistle.mp3        (30 min) - Melodic whistle
    ├── white-noise.mp3    (30 min) - Pure static
    ├── forest.mp3         (30 min) - Forest ambience
    └── nature.mp3         (30 min) - Mixed nature sounds
```

## 🚀 Quick Start - Generate Audio Files

### Option 1: Using the HTML Generator (Recommended for Testing)

1. Open `scripts/generateSilentAudio.html` in your browser
2. Click "Generate All Audio Files"
3. Download all generated WAV files
4. Convert WAV to MP3 (optional, for smaller file size):
   ```bash
   # Using FFmpeg
   ffmpeg -i input.wav -b:a 320k output.mp3
   ```
5. Move files to respective `public/audio/` folders

### Option 2: Use Free Audio Resources

#### For Focus/Relaxation Waves:
- **Generate Binaural Beats:**
  - Use [Audacity](https://www.audacityteam.org/) (Free)
  - Generate Tone (Analyze > Tone Generator)
  - Create two sine waves with frequency difference
  - Left channel: 200 Hz, Right channel: 200 Hz + beat frequency
  
- **Online Generators:**
  - [MyNoise.net](https://mynoise.net/NoiseMachines/binauralBrainwaveGenerator.php)
  - [Gnaural](http://gnaural.sourceforge.net/)

#### For Ambient Sounds:
- **Freesound.org** - Creative Commons licensed sounds
  - Search: "rain loop", "ocean waves", "forest ambience"
  - Filter: CC0 or CC-BY licenses
  - Download high quality versions

- **BBC Sound Effects** - Free for personal use
  - [BBC Sound Effects Library](https://sound-effects.bbcrewind.co.uk/)

- **YouTube Audio Library** - Royalty free
  - [YouTube Audio Library](https://www.youtube.com/audiolibrary)

## 🎯 Audio Requirements

### Technical Specifications:
- **Format:** MP3 or WAV
- **Bitrate:** 320 kbps (MP3) or lossless (WAV)
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Channels:** Stereo (required for binaural beats)
- **Duration:** As specified in structure above
- **Looping:** Files should be seamless (fade in/out at edges)

### Quality Guidelines:
1. **Binaural Beats:**
   - Pure sine waves
   - Left/Right channel frequency difference = desired beat
   - Example: Alpha (10 Hz) = Left 200 Hz, Right 210 Hz
   - No other sounds mixed in

2. **Ambient Sounds:**
   - Natural, high-quality recordings
   - Minimal compression artifacts
   - Loopable without jarring transitions
   - Consistent volume throughout

3. **Focus Tracks:**
   - Can combine binaural beats with ambient sounds
   - Keep volume balanced (not overpowering)
   - Smooth transitions between sections

## ⚡ Using Real-Time Binaural Generation

The app ALREADY generates binaural beats in real-time! No files needed for:
- Alpha (8-12 Hz)
- Beta (13-30 Hz)  
- Gamma (30-100 Hz)
- Theta (4-8 Hz)
- Delta (0.5-4 Hz)

These are created by the `AudioEngine` class using Web Audio API oscillators.

## 🔄 Current Audio System Features

### ✅ Working Features:
1. **Web Audio API Engine** (`src/utils/audioEngine.ts`)
   - Binaural beat generation (real-time)
   - Stereo oscillators with frequency difference
   - Audio file playback support
   - Ambient noise generation (white/pink/brown)
   - Volume control and mixing
   - Frequency visualization

2. **Audio Loader** (`src/lib/audioLoader.ts`)
   - File loading and caching
   - Buffer management
   - Track catalog with metadata

3. **Unified Player** (`src/components/UnifiedAudioPlayer.tsx`)
   - Play/pause/stop controls
   - Track switching (next/previous)
   - Volume control and muting
   - Progress tracking
   - Playlist view
   - Keyboard shortcuts
   - Audio visualizer (3 modes)

4. **Ambient Mixer** (`src/components/AmbientMixer.tsx`)
   - Multiple ambient sound layers
   - Individual volume controls
   - Mix and save presets

5. **Session Timer** (`src/components/FocusTimer.tsx`)
   - Pomodoro technique integration
   - Syncs with audio playback
   - Session tracking

### ❌ Known Issues:
1. **No Audio Files** - All audio folders are empty
2. **Error Handling** - Shows "Failed to play audio" when files missing
3. **Production Build** - May need MIME type configuration for Next.js

## 🛠️ Fixing Audio File Issues

### Step 1: Add Audio Files
```bash
# Navigate to project
cd "c:\Users\Leslie Fernando\Projects\harmonics"

# Audio files should go here:
# public/audio/focus/
# public/audio/relax/
# public/audio/deep/
# public/audio/ambient/
```

### Step 2: Verify Next.js Configuration
The `next.config.ts` should already serve static files correctly:

```typescript
// next.config.ts
const nextConfig = {
  // ... other config
  async headers() {
    return [
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Step 3: Test Audio System
1. Start dev server: `npm run dev`
2. Navigate to `/player`
3. Try playing each track
4. Check browser console for errors

## 🎨 Customizing Audio System

### Adding New Tracks:

1. **Update audioLoader.ts:**
```typescript
export const audioTracks: AudioTrack[] = [
  // Add your track
  {
    id: 'my-custom-track',
    name: 'My Custom Track',
    path: '/audio/focus/my-track.mp3',
    duration: 1800, // seconds
    category: 'focus',
    frequency: '15-20 Hz',
    benefits: ['Benefit 1', 'Benefit 2']
  },
  // ... existing tracks
];
```

2. **Add Audio File:**
   - Place file in appropriate `public/audio/` subfolder
   - Use same filename as specified in `path`

### Modifying Binaural Frequencies:

Edit `src/utils/audioEngine.ts`:
```typescript
export const FrequencyPresets = {
  // Modify existing or add new
  CUSTOM: { baseFrequency: 200, beatFrequency: 15 },
};
```

## 📊 Testing Checklist

- [ ] All audio files present in public/audio/
- [ ] Files are correct format (MP3/WAV)
- [ ] Files are correct duration
- [ ] Files load without CORS errors
- [ ] Files play in browser
- [ ] Volume control works
- [ ] Track switching works
- [ ] Timer syncs with audio
- [ ] Visualizer displays
- [ ] Ambient mixer works
- [ ] No console errors
- [ ] Works in production build

## 🐛 Common Issues

### Issue: "Failed to play audio"
**Cause:** Audio file missing or incorrect path
**Fix:** Verify file exists at path specified in `audioLoader.ts`

### Issue: CORS error
**Cause:** Browser blocking audio load
**Fix:** Files in `public/` should work automatically with Next.js

### Issue: Audio context suspended
**Cause:** Browser autoplay policy
**Fix:** Already handled - context resumes on user interaction

### Issue: Choppy playback
**Cause:** Large uncompressed files
**Fix:** Use 320kbps MP3 instead of WAV for production

## 📈 Future Enhancements

- [ ] Dynamic audio loading (load on demand)
- [ ] Crossfade between tracks
- [ ] User-uploaded custom tracks
- [ ] Spotify/YouTube integration
- [ ] Offline PWA audio caching
- [ ] EQ and audio effects
- [ ] Spatial audio support
- [ ] Voice-guided meditation integration

## 📞 Support

If audio system issues persist:
1. Check browser console for errors
2. Verify audio file formats and paths
3. Test with different browsers
4. Check Next.js production build logs

---

**Last Updated:** November 2025
**System Version:** Harmony v1.0
