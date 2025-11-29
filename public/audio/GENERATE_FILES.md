# Audio File Generation Script

This script helps generate placeholder audio files for development.
For production, replace with actual professionally-mastered binaural beats.

## Quick Setup (Development Only)

### Option 1: Use Silence Generator (PowerShell)

```powershell
# Navigate to the audio directory
cd public/audio

# Generate 1-second silent MP3 placeholders
# Note: These won't produce binaural effects, but allow testing file playback

# Focus tracks
New-Item -ItemType File -Path "focus/alpha-focus.mp3" -Force
New-Item -ItemType File -Path "focus/beta-focus.mp3" -Force
New-Item -ItemType File -Path "focus/gamma-focus.mp3" -Force

# Relaxation tracks
New-Item -ItemType File -Path "relax/theta-relax.mp3" -Force
New-Item -ItemType File -Path "relax/alpha-calm.mp3" -Force

# Deep focus tracks
New-Item -ItemType File -Path "deep/deep-focus.mp3" -Force
New-Item -ItemType File -Path "deep/study-wave.mp3" -Force

# Ambient sounds
New-Item -ItemType File -Path "ambient/rain.mp3" -Force
New-Item -ItemType File -Path "ambient/ocean.mp3" -Force
New-Item -ItemType File -Path "ambient/wind.mp3" -Force
New-Item -ItemType File -Path "ambient/whistle.mp3" -Force
New-Item -ItemType File -Path "ambient/white-noise.mp3" -Force
New-Item -ItemType File -Path "ambient/forest.mp3" -Force
New-Item -ItemType File -Path "ambient/nature.mp3" -Force
```

### Option 2: Download Free Binaural Beats

1. **YouTube Audio Library** (Royalty-free):
   - https://www.youtube.com/audiolibrary

2. **Freesound.org** (Creative Commons):
   - https://freesound.org/search/?q=binaural

3. **Free Music Archive**:
   - https://freemusicarchive.org/

### Option 3: Generate with Audacity (Free Software)

1. Download Audacity: https://www.audacityteam.org/
2. For each track:
   ```
   Generate > Tone...
   - Waveform: Sine
   - Frequency: 200 Hz (left channel)
   - Amplitude: 0.5
   - Duration: 25 minutes (1500 seconds)
   
   Duplicate track
   Pan left track: Left
   Pan right track: Right
   
   Change right channel frequency:
   - Alpha (10 Hz): 210 Hz
   - Beta (20 Hz): 220 Hz
   - Theta (6 Hz): 206 Hz
   - Delta (2 Hz): 202 Hz
   - Gamma (40 Hz): 240 Hz
   
   File > Export > Export as MP3
   ```

### Option 4: Use Online Generators

1. **Gnaural** (Desktop app):
   - https://gnaural.sourceforge.net/

2. **SBaGen** (Command-line):
   - http://uazu.net/sbagen/

## Important Notes

- ⚠️ Empty/placeholder files will cause playback errors
- ✅ The app falls back to Web Audio API real-time generation when files are missing
- 🎯 For production: Use professionally mastered binaural beats
- 📝 Ensure proper licensing for any audio used

## Real-Time Generation Fallback

The app automatically uses Web Audio API to generate binaural beats in real-time when audio files are not found. This means:

- ✅ App works immediately without audio files
- ✅ Binaural beats are generated on-the-fly
- ✅ Lower bandwidth usage
- ⚠️ Higher CPU usage
- ⚠️ Basic sine wave tones (less pleasant than mastered audio)

For development, you can skip adding audio files entirely!

## Production Recommendations

1. Hire audio professional or purchase licensed tracks
2. Master audio with:
   - Proper EQ
   - Background ambient layers
   - Smooth fade in/out
   - Binaural panning
3. Optimize file sizes (192 kbps MP3 or compressed AAC)
4. Test on multiple devices
5. Provide download option for offline use

---

**Bottom Line**: The app works without audio files using real-time generation. Audio files are optional enhancements for better quality and lower CPU usage.
