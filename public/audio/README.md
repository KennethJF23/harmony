# Harmony Audio Files

This directory contains all audio assets for the Harmony binaural beats application.

## Directory Structure

```
audio/
├── focus/          # Focus-enhancing tracks
├── relax/          # Relaxation tracks
├── deep/           # Deep focus sessions
├── ambient/        # Ambient sounds (rain, ocean, etc.)
└── README.md
```

## Audio File Requirements

### Format Specifications
- **Format**: MP3 or WAV
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Bit Rate**: 192 kbps minimum (for MP3)
- **Channels**: Stereo (required for binaural beats)
- **Duration**: Variable (15-60 minutes recommended)

### File Naming Convention
Use lowercase with hyphens:
- `alpha-focus.mp3`
- `theta-relax.mp3`
- `deep-focus.mp3`

## Required Audio Files

### Focus Tracks (`/audio/focus/`)
1. `alpha-focus.mp3` - Alpha wave (8-12 Hz) for concentration
2. `beta-focus.mp3` - Beta wave (13-30 Hz) for active thinking
3. `gamma-focus.mp3` - Gamma wave (30-100 Hz) for peak performance

### Relaxation Tracks (`/audio/relax/`)
1. `theta-relax.mp3` - Theta wave (4-8 Hz) for deep relaxation
2. `alpha-calm.mp3` - Alpha wave (8-12 Hz) for calm state

### Deep Focus Tracks (`/audio/deep/`)
1. `deep-focus.mp3` - 45-minute deep focus session (14-20 Hz)
2. `study-wave.mp3` - 50-minute study session (12-18 Hz)

### Ambient Sounds (`/audio/ambient/`)
1. `rain.mp3` - Gentle rainfall
2. `ocean.mp3` - Ocean waves
3. `wind.mp3` - Soft wind sounds
4. `whistle.mp3` - Melodic whistle
5. `white-noise.mp3` - White noise masking
6. `forest.mp3` - Forest ambience
7. `nature.mp3` - Mixed nature sounds

## Generating Binaural Beats Audio

### Option 1: Use Online Generators
- **Gnaural**: https://gnaural.sourceforge.net/
- **SBaGen**: http://uazu.net/sbagen/
- **Audacity** with Tone Generator plugin

### Option 2: Use Audio Production Software
1. **Audacity** (Free):
   - Generate > Tone
   - Create two sine waves with frequency difference
   - Pan one left, one right
   - Export as stereo MP3

2. **Ableton Live / FL Studio**:
   - Use oscillators for precise frequency control
   - Apply stereo separation
   - Export high-quality audio

### Option 3: Use Pre-made Libraries
- **YouTube Audio Library** (check license)
- **Freesound.org** (Creative Commons)
- **Free Music Archive**

## Temporary Development Solution

The app includes a **fallback system** that generates binaural beats in real-time using Web Audio API when audio files are missing. This ensures the app works during development even without audio files.

For production, real audio files provide:
- Better audio quality
- Lower CPU usage
- Consistent experience across devices
- Pre-mastered professional sound

## Testing Audio Files

After adding audio files:

1. Check file paths match the catalog in `src/lib/audioLoader.ts`
2. Verify files load in browser console
3. Test playback on multiple devices
4. Confirm stereo separation (use headphones)
5. Validate duration matches metadata

## Notes

- Binaural beats require **headphones** for effectiveness
- Files should be optimized for web (compressed but high quality)
- Consider lazy loading for better performance
- Provide fallback for missing files (Web Audio API generation)
- Include proper attribution if using CC-licensed audio

## License

Ensure all audio files are either:
- Original works you own
- Licensed for commercial use
- Public domain
- Properly attributed Creative Commons works

---

**For Development**: The app will function without these files by using real-time Web Audio API generation. However, for production deployment, proper audio files should be added.
