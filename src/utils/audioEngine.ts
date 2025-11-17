/**
 * Audio Engine for Binaural Beats Generation
 * Generates real-time binaural beats using Web Audio API
 */

export interface BinauralConfig {
  baseFrequency: number;
  beatFrequency: number;
  volume: number;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private leftGain: GainNode | null = null;
  private rightGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyDataArray: Uint8Array = new Uint8Array(0);
  private isInitialized: boolean = false;
  private isPlaying: boolean = false;
  
  // Ambient sound sources
  private ambientSources: Map<string, AudioBufferSourceNode> = new Map();
  private ambientGains: Map<string, GainNode> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
      this.isInitialized = false;
    }
  }

  /**
   * Start playing binaural beats
   */
  public async start(config: BinauralConfig): Promise<void> {
    if (!this.audioContext || !this.isInitialized) {
      throw new Error('AudioContext not initialized');
    }

    // Resume AudioContext if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Stop any existing audio
    this.stop();

    // Create oscillators
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();

    // Create gain nodes
    this.leftGain = this.audioContext.createGain();
    this.rightGain = this.audioContext.createGain();
    this.masterGain = this.audioContext.createGain();

    // Create channel merger for stereo output
    this.merger = this.audioContext.createChannelMerger(2);

    // Set frequencies
    // Left ear: base frequency
    this.leftOscillator.frequency.value = config.baseFrequency;
    // Right ear: base frequency + beat frequency
    this.rightOscillator.frequency.value = config.baseFrequency + config.beatFrequency;

    // Set wave type (sine wave for pure tones)
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    // Set individual channel gains
    this.leftGain.gain.value = 0.5;
    this.rightGain.gain.value = 0.5;

    // Set master volume
    this.masterGain.gain.value = config.volume / 100;

    // Connect the audio graph
    // Left channel
    this.leftOscillator.connect(this.leftGain);
    this.leftGain.connect(this.merger, 0, 0);

    // Right channel
    this.rightOscillator.connect(this.rightGain);
    this.rightGain.connect(this.merger, 0, 1);

    // Create analyser for visualizer
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    this.frequencyDataArray = new Uint8Array(this.analyser.frequencyBinCount);

    // Master output with analyser
    this.merger.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Start oscillators
    this.leftOscillator.start();
    this.rightOscillator.start();

    this.isPlaying = true;
  }

  /**
   * Stop playing binaural beats
   */
  public stop(): void {
    if (this.leftOscillator) {
      this.leftOscillator.stop();
      this.leftOscillator.disconnect();
      this.leftOscillator = null;
    }

    if (this.rightOscillator) {
      this.rightOscillator.stop();
      this.rightOscillator.disconnect();
      this.rightOscillator = null;
    }

    if (this.leftGain) {
      this.leftGain.disconnect();
      this.leftGain = null;
    }

    if (this.rightGain) {
      this.rightGain.disconnect();
      this.rightGain = null;
    }

    if (this.merger) {
      this.merger.disconnect();
      this.merger = null;
    }

    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }

    this.isPlaying = false;
  }

  /**
   * Update volume in real-time
   */
  public setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume / 100, this.audioContext!.currentTime);
    }
  }

  /**
   * Smoothly change frequency (for track transitions)
   */
  public transitionTo(config: BinauralConfig, duration: number = 2): void {
    if (!this.leftOscillator || !this.rightOscillator || !this.audioContext) {
      return;
    }

    const currentTime = this.audioContext.currentTime;

    // Smooth frequency transition
    this.leftOscillator.frequency.setTargetAtTime(
      config.baseFrequency,
      currentTime,
      duration / 3
    );

    this.rightOscillator.frequency.setTargetAtTime(
      config.baseFrequency + config.beatFrequency,
      currentTime,
      duration / 3
    );

    // Smooth volume transition
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        config.volume / 100,
        currentTime,
        duration / 3
      );
    }
  }

  /**
   * Add white noise for ambient sound
   */
  public addWhiteNoise(intensity: number = 0.1): AudioBufferSourceNode | null {
    if (!this.audioContext) return null;

    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.value = intensity;

    whiteNoise.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);

    whiteNoise.start();
    return whiteNoise;
  }

  /**
   * Check if audio is currently playing
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get current audio context state
   */
  public getState(): string {
    return this.audioContext?.state || 'unavailable';
  }

  /**
   * Get frequency data for visualizer
   */
  public getFrequencyData(): Uint8Array {
    if (this.analyser && this.frequencyDataArray.length > 0) {
      this.analyser.getByteFrequencyData(this.frequencyDataArray);
      return this.frequencyDataArray;
    }
    return new Uint8Array(0);
  }

  /**
   * Get time domain data for waveform
   */
  public getTimeDomainData(): Uint8Array {
    if (this.analyser) {
      const data = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(data);
      return data;
    }
    return new Uint8Array(0);
  }

  /**
   * Start ambient sound (generates white/pink/brown noise)
   */
  public async startAmbient(type: 'rain' | 'whitenoise' | 'forest' | 'ocean', volume: number = 0.3): Promise<void> {
    if (!this.audioContext || this.ambientSources.has(type)) return;

    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const output = noiseBuffer.getChannelData(channel);
      
      switch(type) {
        case 'whitenoise':
          // White noise
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          break;
        case 'rain':
          // Pink noise (approximation for rain)
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
          }
          break;
        case 'ocean':
          // Brown noise (low frequency for ocean)
          let lastOut = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          }
          break;
        case 'forest':
          // Filtered white noise for forest ambience
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.5;
          }
          break;
      }
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const gain = this.audioContext.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    
    if (this.analyser) {
      gain.connect(this.analyser);
    } else {
      gain.connect(this.audioContext.destination);
    }

    source.start();
    
    this.ambientSources.set(type, source);
    this.ambientGains.set(type, gain);
  }

  /**
   * Stop ambient sound
   */
  public stopAmbient(type: string): void {
    const source = this.ambientSources.get(type);
    const gain = this.ambientGains.get(type);
    
    if (source && gain) {
      source.stop();
      source.disconnect();
      gain.disconnect();
      this.ambientSources.delete(type);
      this.ambientGains.delete(type);
    }
  }

  /**
   * Set ambient sound volume
   */
  public setAmbientVolume(type: string, volume: number): void {
    const gain = this.ambientGains.get(type);
    if (gain && this.audioContext) {
      gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  /**
   * Check if ambient is playing
   */
  public isAmbientPlaying(type: string): boolean {
    return this.ambientSources.has(type);
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    this.stop();
    
    // Stop all ambient sounds
    this.ambientSources.forEach((_, type) => this.stopAmbient(type));
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance
let audioEngineInstance: AudioEngine | null = null;

export const getAudioEngine = (): AudioEngine => {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
};

// Frequency presets for different brain wave states
export const FrequencyPresets = {
  DELTA: { baseFrequency: 200, beatFrequency: 2 }, // Deep sleep (0.5-4 Hz)
  THETA: { baseFrequency: 200, beatFrequency: 6 }, // Meditation (4-8 Hz)
  ALPHA: { baseFrequency: 200, beatFrequency: 10 }, // Relaxation (8-12 Hz)
  BETA: { baseFrequency: 200, beatFrequency: 20 }, // Focus (13-30 Hz)
  GAMMA: { baseFrequency: 200, beatFrequency: 40 }, // Cognitive enhancement (30-100 Hz)
};
