/**
 * Global Audio-Timer Store
 * Manages synchronized state between audio player and focus timer
 */

import { create } from 'zustand';

export interface Track {
  id: number;
  title: string;
  frequency: string;
  duration: number; // in seconds
  baseFrequency: number;
  beatFrequency: number;
  category: 'focus' | 'relaxation' | 'creativity' | 'sleep';
}

interface AudioTimerState {
  // Audio state
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  currentTime: number;
  
  // Timer state
  timerDuration: number; // in seconds
  timeLeft: number;
  isTimerRunning: boolean;
  sessionStartTime: number | null;
  
  // Actions
  setIsPlaying: (playing: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  
  setTimerDuration: (duration: number) => void;
  setTimeLeft: (time: number) => void;
  setIsTimerRunning: (running: boolean) => void;
  setSessionStartTime: (time: number | null) => void;
  
  // Synchronized actions
  startSession: () => void;
  pauseSession: () => void;
  stopSession: () => void;
  resetSession: () => void;
}

export const useAudioTimerStore = create<AudioTimerState>((set, get) => ({
  // Initial audio state
  isPlaying: false,
  currentTrack: null,
  volume: 75,
  currentTime: 0,
  
  // Initial timer state
  timerDuration: 1500, // 25 minutes default
  timeLeft: 1500,
  isTimerRunning: false,
  sessionStartTime: null,
  
  // Audio setters
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  
  // Timer setters
  setTimerDuration: (duration) => set({ timerDuration: duration, timeLeft: duration }),
  setTimeLeft: (time) => set({ timeLeft: time }),
  setIsTimerRunning: (running) => set({ isTimerRunning: running }),
  setSessionStartTime: (time) => set({ sessionStartTime: time }),
  
  // Synchronized actions
  startSession: () => {
    const state = get();
    if (!state.sessionStartTime) {
      set({ 
        sessionStartTime: Date.now(),
        isPlaying: true,
        isTimerRunning: true
      });
    } else {
      set({ 
        isPlaying: true,
        isTimerRunning: true
      });
    }
  },
  
  pauseSession: () => {
    set({ 
      isPlaying: false,
      isTimerRunning: false
    });
  },
  
  stopSession: () => {
    const state = get();
    set({ 
      isPlaying: false,
      isTimerRunning: false,
      currentTime: 0,
      timeLeft: state.timerDuration,
      sessionStartTime: null
    });
  },
  
  resetSession: () => {
    const state = get();
    set({ 
      isPlaying: false,
      isTimerRunning: false,
      currentTime: 0,
      timeLeft: state.timerDuration,
      sessionStartTime: null
    });
  },
}));
