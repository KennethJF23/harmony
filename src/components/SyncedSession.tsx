'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import UnifiedAudioPlayer from '@/components/UnifiedAudioPlayer';
import FocusTimer from '@/components/FocusTimer';
import SessionSurveyPopup, { SURVEY_QUESTIONS } from '@/components/SessionSurveyPopup';

interface SyncedSessionProps {
  initialTrackId?: string;
}

/**
 * Synced Session Component
 * Provides perfect synchronization between audio playback and focus timer
 */
const SyncedSession = ({ initialTrackId }: SyncedSessionProps) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');
  const [timerShouldStart, setTimerShouldStart] = useState(false);
  const [timerShouldStop, setTimerShouldStop] = useState(false);

  // Survey state
  const [showSurvey, setShowSurvey] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<Array<{
    questionId: number;
    question: string;
    answer: string;
    timestamp: number;
    trackName: string;
  }>>([]);
  const [randomizedQuestions, setRandomizedQuestions] = useState<typeof SURVEY_QUESTIONS>([]);
  const surveyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const MAX_QUESTIONS_PER_SESSION = 3;

  // Initialize randomized questions on mount
  useEffect(() => {
    const shuffled = [...SURVEY_QUESTIONS].sort(() => Math.random() - 0.5);
    // Limit to max questions per session
    setRandomizedQuestions(shuffled.slice(0, MAX_QUESTIONS_PER_SESSION));
  }, []);

  // Survey timer: show question every 20 seconds when audio is playing
  useEffect(() => {
    console.log('Survey effect triggered:', { isAudioPlaying, randomizedQuestionsLength: randomizedQuestions.length, askedQuestionsLength: askedQuestions.length });
    
    if (isAudioPlaying && randomizedQuestions.length > 0) {
      // Start session timer
      if (sessionStartTimeRef.current === 0) {
        sessionStartTimeRef.current = Date.now();
        console.log('Session started at:', sessionStartTimeRef.current);
      }

      // Show first question after 20 seconds
      console.log('Setting up survey interval...');
      surveyIntervalRef.current = setInterval(() => {
        console.log('Survey interval fired. Asked questions:', askedQuestions.length, 'Total questions:', randomizedQuestions.length);
        if (askedQuestions.length < randomizedQuestions.length) {
          console.log('Showing survey popup');
          setShowSurvey(true);
        } else {
          // All questions asked, stop survey
          console.log('All questions asked, stopping survey');
          if (surveyIntervalRef.current) {
            clearInterval(surveyIntervalRef.current);
          }
        }
      }, 20000); // Every 20 seconds during playback

      return () => {
        console.log('Cleaning up survey interval');
        if (surveyIntervalRef.current) {
          clearInterval(surveyIntervalRef.current);
        }
      };
    } else {
      // Pause survey when audio stops
      console.log('Audio not playing or no questions, clearing interval');
      if (surveyIntervalRef.current) {
        clearInterval(surveyIntervalRef.current);
      }
    }
  }, [isAudioPlaying, askedQuestions.length, randomizedQuestions.length]);

  const handleSurveyAnswer = useCallback(async (questionId: number, answer: string) => {
    const question = SURVEY_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    const response = {
      questionId,
      question: question.question,
      answer,
      timestamp: Date.now() - sessionStartTimeRef.current,
      trackName: currentTrack,
    };

    setSurveyResponses(prev => [...prev, response]);
    setAskedQuestions(prev => [...prev, questionId]);
    setShowSurvey(false);
    setCurrentQuestionIndex(prev => prev + 1);

    // Save to backend
    try {
      const userEmail = localStorage.getItem('userEmail');
      await fetch('/api/survey/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          sessionId: `session_${sessionStartTimeRef.current}`,
          ...response,
          category: question.category,
          questionType: question.type,
        }),
      });
    } catch (error) {
      console.error('Failed to save survey response:', error);
    }
  }, [currentTrack]);

  const handleSurveySkip = useCallback(() => {
    setAskedQuestions(prev => [...prev, randomizedQuestions[currentQuestionIndex]?.id]);
    setShowSurvey(false);
    setCurrentQuestionIndex(prev => prev + 1);
  }, [currentQuestionIndex, randomizedQuestions]);

  // Handle audio play state changes
  const handleAudioPlayStateChange = useCallback((playing: boolean) => {
    setIsAudioPlaying(playing);
    
    if (playing) {
      // Audio started, signal timer to start
      setTimerShouldStart(true);
      setTimeout(() => setTimerShouldStart(false), 100);
    } else {
      // Audio stopped, signal timer to pause
      setTimerShouldStop(true);
      setTimeout(() => setTimerShouldStop(false), 100);
    }
  }, []);

  // Handle track changes
  const handleTrackChange = useCallback((trackName: string) => {
    // Reset per-track survey state
    setCurrentTrack(trackName);
    setAskedQuestions([]);
    setCurrentQuestionIndex(0);
    // Re-randomize and cap to MAX_QUESTIONS_PER_SESSION for the new track
    const shuffled = [...SURVEY_QUESTIONS].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffled.slice(0, MAX_QUESTIONS_PER_SESSION));
  }, []);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    // Timer completed, stop the audio
    // This will be handled by the audio player receiving the stop signal
    console.log('Timer completed - session finished');
  }, []);

  // Handle timer start
  const handleTimerStart = useCallback(() => {
    console.log('Timer started');
    // Timer is now synced with audio
  }, []);

  // Handle timer stop
  const handleTimerStop = useCallback(() => {
    console.log('Timer stopped');
    // Timer is paused/stopped
  }, []);

  return (
    <div className="space-y-8">
      {/* Sync Status Indicator */}
      {isAudioPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <span className="text-sm font-medium">
              Session Active: {currentTrack}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Audio Player - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <UnifiedAudioPlayer
            initialTrackId={initialTrackId}
            autoPlay={false}
            onPlayStateChange={handleAudioPlayStateChange}
            onTrackChange={handleTrackChange}
          />
        </div>

        {/* Focus Timer - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <FocusTimer
            isAudioPlaying={isAudioPlaying}
            currentTrackName={currentTrack}
            onTimerComplete={handleTimerComplete}
            onTimerStart={handleTimerStart}
            onTimerStop={handleTimerStop}
          />
        </div>
      </div>

      {/* Session Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[var(--surface)]/80 to-[var(--surface-alt)]/60 backdrop-blur-xl rounded-2xl p-6 border border-[var(--primary)]/20"
      >
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          How to Use Synced Sessions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Choose Your Track</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Select a focus wave that matches your task - Beta for active work, Alpha for creative tasks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Set Your Timer</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Choose a Pomodoro preset or customize your focus duration
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Start Together</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Press play on the audio - your timer will automatically sync and start
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Stay Focused</p>
                <p className="text-sm text-[var(--foreground)]/70">
                  Both audio and timer will pause/resume together - perfect sync every time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 pt-6 border-t border-[var(--foreground)]/10">
          <p className="text-sm font-semibold text-[var(--foreground)] mb-3">💡 Pro Tips:</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--foreground)]/70">
            <div className="flex items-start gap-2">
              <span className="text-[var(--primary)]">•</span>
              <span>Use headphones for binaural beats to work effectively</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--accent)]">•</span>
              <span>Keep volume comfortable - not too loud, just audible</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--secondary)]">•</span>
              <span>Take breaks between sessions to maximize productivity</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scientific Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-[var(--wave)]/10 to-[var(--accent)]/10 border border-[var(--wave)]/20 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <span className="text-xl">🧠</span>
          The Science Behind Synced Sessions
        </h3>
        <div className="space-y-3 text-sm text-[var(--foreground)]/80">
          <p>
            <strong className="text-[var(--foreground)]">Binaural Beats:</strong> When each ear receives a slightly different frequency, your brain perceives a third "phantom" frequency - the difference between the two. This encourages your brainwaves to synchronize to that frequency.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Pomodoro Technique:</strong> Working in focused intervals (typically 25 minutes) followed by short breaks has been scientifically proven to enhance concentration and prevent burnout.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Synergistic Effect:</strong> By combining binaural beats with timed focus sessions, you create an optimal environment for deep work and sustained concentration.
          </p>
        </div>
      </motion.div>

      {/* Survey Popup */}
      <SessionSurveyPopup
        isVisible={showSurvey}
        currentQuestion={randomizedQuestions[currentQuestionIndex] || null}
        onAnswer={handleSurveyAnswer}
        onSkip={handleSurveySkip}
        questionNumber={Math.min(askedQuestions.length + 1, MAX_QUESTIONS_PER_SESSION)}
        totalQuestions={MAX_QUESTIONS_PER_SESSION}
      />
    </div>
  );
};

export default SyncedSession;
