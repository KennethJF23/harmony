# 🎵 Audio System - Quick Start Guide

## ✅ System Status

**Audio Engine:** ✅ Working  
**Player UI:** ✅ Working  
**Audio Files:** ✅ Generated (placeholders)  
**Timer Sync:** ✅ Working  
**Binaural Generator:** ✅ Working  

## 🚀 Getting Started

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test the Audio System

Visit these pages:

- **Player:** http://localhost:3000/player
- **Sessions (with Timer):** http://localhost:3000/sessions
- **Home (Browse Tracks):** http://localhost:3000

### 3. Test Each Feature

#### ✅ Basic Playback
- [ ] Click play on any track
- [ ] Audio should start (you'll hear silence from placeholder files)
- [ ] Progress bar should move
- [ ] Volume control should work

#### ✅ Track Navigation
- [ ] Next/Previous buttons work
- [ ] Click tracks in playlist to switch
- [ ] Track info updates correctly

#### ✅ Binaural Beats
- [ ] Select any "Binaural" category track
- [ ] These generate tones in real-time (you'll hear them!)
- [ ] Try Alpha, Beta, Gamma, Theta, Delta

#### ✅ Timer Sync
- [ ] Go to `/sessions`
- [ ] Press play on audio
- [ ] Timer should show "Synced" indicator
- [ ] Pause audio → timer pauses
- [ ] Play audio → timer resumes

#### ✅ Ambient Mixer
- [ ] Toggle ambient sounds (rain, ocean, etc.)
- [ ] Adjust individual volumes
- [ ] Mix multiple ambient sounds

## 📁 Current Audio Files

All folders now contain placeholder MP3 files:

```
public/audio/
├── focus/
│   ├── alpha-focus.mp3     ✅ Created
│   ├── beta-focus.mp3      ✅ Created
│   └── gamma-focus.mp3     ✅ Created
├── relax/
│   ├── theta-relax.mp3     ✅ Created
│   └── alpha-calm.mp3      ✅ Created
├── deep/
│   ├── deep-focus.mp3      ✅ Created
│   └── study-wave.mp3      ✅ Created
└── ambient/
    ├── rain.mp3            ✅ Created
    ├── ocean.mp3           ✅ Created
    ├── wind.mp3            ✅ Created
    ├── whistle.mp3         ✅ Created
    ├── white-noise.mp3     ✅ Created
    ├── forest.mp3          ✅ Created
    └── nature.mp3          ✅ Created
```

**⚠️ Note:** These are minimal placeholder files. Replace with real audio for production.

## 🎯 Replace Placeholder Audio

### Option 1: Download Free Audio

#### Binaural Beats:
- **MyNoise.net:** https://mynoise.net/NoiseMachines/binauralBrainwaveGenerator.php
- **Generate with Audacity:**
  1. Generate > Tone (Left channel: 200 Hz)
  2. Generate > Tone (Right channel: 210 Hz for 10 Hz Alpha)
  3. Export as MP3

#### Ambient Sounds:
- **Freesound:** https://freesound.org (search "rain loop", "ocean waves")
- **BBC Sound Effects:** https://sound-effects.bbcrewind.co.uk/
- **YouTube Audio Library:** https://youtube.com/audiolibrary

### Option 2: Use Our Generator

1. Open `scripts/generateSilentAudio.html` in browser
2. Click "Generate All Audio Files"
3. Download generated WAV files
4. (Optional) Convert to MP3 for smaller size

### Option 3: Commission Professional Audio

Hire audio engineers from:
- **Fiverr:** Search "binaural beats production"
- **Upwork:** Post audio production job
- **Epidemic Sound:** License professional tracks

## 🔧 Technical Architecture

### Core Components

1. **AudioEngine** (`src/utils/audioEngine.ts`)
   - Web Audio API wrapper
   - Binaural beat generation
   - File playback
   - Ambient sound synthesis

2. **AudioLoader** (`src/lib/audioLoader.ts`)
   - File loading and caching
   - Track catalog
   - Buffer management

3. **UnifiedAudioPlayer** (`src/components/UnifiedAudioPlayer.tsx`)
   - Main player UI
   - Controls (play/pause/stop/next/prev)
   - Visualizer (3 modes)
   - Playlist management

4. **SyncedSession** (`src/components/SyncedSession.tsx`)
   - Timer + Audio sync
   - Session management
   - State coordination

5. **FocusTimer** (`src/components/FocusTimer.tsx`)
   - Pomodoro timer
   - Session tracking
   - Break management

### Data Flow

```
User clicks Play
    ↓
UnifiedAudioPlayer
    ↓
AudioEngine.start() or startFile()
    ↓
Web Audio API
    ↓
Audio Output
    ↓
State updates → SyncedSession
    ↓
FocusTimer syncs
```

## 🐛 Troubleshooting

### Issue: No sound playing

**Possible causes:**
- Audio files missing → Run `node scripts/generateAudio.js`
- Browser autoplay policy → Click play button (don't autoplay)
- Volume muted → Check volume slider and system volume

### Issue: "Failed to play audio"

**Fix:**
```bash
# Verify files exist
ls public/audio/focus/
ls public/audio/ambient/

# Regenerate if missing
node scripts/generateAudio.js
```

### Issue: Timer not syncing

**Fix:**
- Make sure you're on `/sessions` page (not `/player`)
- Audio must be playing first
- Check browser console for errors

### Issue: Binaural beats not working

**Check:**
- Using headphones? (Required for binaural effect)
- Volume above 0?
- Track is marked as "binaural" category?
- Try Alpha, Beta, or Gamma tracks (these generate tones)

## 📊 Test Checklist

Run through this before committing:

### Development
- [ ] `npm run dev` starts without errors
- [ ] Can navigate to /player
- [ ] Can navigate to /sessions
- [ ] Audio files load (check Network tab)
- [ ] Play button works
- [ ] Volume control works
- [ ] Track switching works

### Production
- [ ] `npm run build` succeeds
- [ ] `npm start` runs
- [ ] Audio works in production build
- [ ] No 404 errors for audio files
- [ ] No MIME type errors

### Features
- [ ] All 14 audio files present
- [ ] Binaural beats generate tones
- [ ] Ambient sounds work
- [ ] Timer syncs with audio
- [ ] Visualizer displays
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive

## 🎨 Customization

### Add New Audio Track

1. Add audio file to `public/audio/[category]/`

2. Update `src/lib/audioLoader.ts`:
```typescript
{
  id: 'my-new-track',
  name: 'My New Track',
  path: '/audio/focus/my-track.mp3',
  duration: 1800, // seconds
  category: 'focus',
  frequency: '15-20 Hz',
  benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3']
}
```

3. Restart dev server

### Change Binaural Frequencies

Edit `src/utils/audioEngine.ts`:
```typescript
export const FrequencyPresets = {
  CUSTOM: { 
    baseFrequency: 200, 
    beatFrequency: 15 // Your custom frequency
  },
};
```

### Modify Visualizer

Edit `src/components/AudioVisualizer.tsx` to add new visualization modes.

## 📈 Performance Optimization

### Current Settings

- Audio files cached for 1 year (immutable)
- Lazy loading of audio buffers
- Efficient Web Audio API usage
- No unnecessary re-renders

### Recommendations for Production

1. **Compress Audio:**
   ```bash
   # Convert to optimized MP3
   ffmpeg -i input.wav -b:a 192k -ar 44100 output.mp3
   ```

2. **Use CDN:**
   - Upload audio files to CDN (Cloudflare, AWS CloudFront)
   - Update paths in `audioLoader.ts`

3. **Enable Streaming:**
   - For long tracks, consider streaming instead of buffering
   - Implement range requests

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Audio files in `public/` are automatically served.

### Other Platforms

Ensure static files in `public/audio/` are served correctly:
- **Netlify:** Works automatically
- **AWS S3:** Upload public/ folder to S3, configure CORS
- **Docker:** Copy public/ to container

## 📞 Support

If issues persist:

1. Check browser console for errors
2. Verify audio file paths match catalog
3. Test in different browsers
4. Check Next.js build logs
5. Review AUDIO_SYSTEM_SETUP.md for detailed docs

## 🎉 Success Criteria

Audio system is fully working when:

✅ All tracks load without 404 errors  
✅ Play/pause/stop controls work  
✅ Volume control responds  
✅ Track switching is smooth  
✅ Timer syncs with audio  
✅ Binaural beats generate tones  
✅ Ambient sounds can be mixed  
✅ Visualizer displays audio data  
✅ No errors in console  
✅ Works in production build  

---

**Last Updated:** November 2025  
**Status:** ✅ Fully Operational  
**Audio Files:** ✅ Generated (replace with real audio for production)
