'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain } from 'lucide-react';

// All 50 research questions organized by category
const SURVEY_QUESTIONS = [
  // Neural & Cognitive Effect Tracking (1-10)
  { id: 1, question: "Any tingling sensation near temples or forehead?", type: "yesno", category: "neural" },
  { id: 2, question: "Do the tones feel mentally synchronizing or random?", type: "binary", options: ["Synchronizing", "Random"], category: "neural" },
  { id: 3, question: "Moment-to-moment thought flow: smoother or unchanged?", type: "binary", options: ["Smoother", "Unchanged"], category: "neural" },
  { id: 4, question: "Are you feeling mentally anchored in the present?", type: "yesno", category: "neural" },
  { id: 5, question: "Sensory load perception: lower, same, or higher?", type: "scale", options: ["Lower", "Same", "Higher"], category: "neural" },
  { id: 6, question: "Do the tones feel mentally stimulating or soothing?", type: "binary", options: ["Stimulating", "Soothing"], category: "neural" },
  { id: 7, question: "Do you notice internal visualization appearing more easily?", type: "yesno", category: "neural" },
  { id: 8, question: "Mental effort level right now: low, moderate, or high?", type: "scale", options: ["Low", "Moderate", "High"], category: "neural" },
  { id: 9, question: "Awareness of surroundings: increased, same, or reduced?", type: "scale", options: ["Increased", "Same", "Reduced"], category: "neural" },
  { id: 10, question: "Do you feel a subtle rhythm in your thinking pace now?", type: "yesno", category: "neural" },

  // Auditory Perception & Entrainment Feedback (11-20)
  { id: 11, question: "Does the beat feel like it's \"pulling\" your attention?", type: "yesno", category: "auditory" },
  { id: 12, question: "Are the sound transitions smooth enough?", type: "yesno", category: "auditory" },
  { id: 13, question: "Do tones feel harmonized or clashing?", type: "binary", options: ["Harmonized", "Clashing"], category: "auditory" },
  { id: 14, question: "Do you notice any temporal pattern matching your breath/attention?", type: "yesno", category: "auditory" },
  { id: 15, question: "Does the audio feel spatial (expanding around you) or flat?", type: "binary", options: ["Spatial", "Flat"], category: "auditory" },
  { id: 16, question: "Is the frequency pulse predictable or surprising?", type: "binary", options: ["Predictable", "Surprising"], category: "auditory" },
  { id: 17, question: "Would you prefer tighter or looser beat spacing?", type: "binary", options: ["Tighter", "Looser"], category: "auditory" },
  { id: 18, question: "Do you sense audio dominance in: left, right, or balanced?", type: "scale", options: ["Left", "Balanced", "Right"], category: "auditory" },
  { id: 19, question: "Do tones feel more background or foreground right now?", type: "binary", options: ["Background", "Foreground"], category: "auditory" },
  { id: 20, question: "Does the beat tempo feel: calming, neutral, or urgent?", type: "scale", options: ["Calming", "Neutral", "Urgent"], category: "auditory" },

  // Mental State Micro-Metrics (21-30)
  { id: 21, question: "Cognitive momentum now feels: rising, stable, or dropping?", type: "scale", options: ["Rising", "Stable", "Dropping"], category: "mental_state" },
  { id: 22, question: "Do you feel mental fatigue shifting while listening?", type: "yesno", category: "mental_state" },
  { id: 23, question: "Is your internal dialogue volume lower right now?", type: "yesno", category: "mental_state" },
  { id: 24, question: "Are you experiencing micro-flashes of distraction?", type: "yesno", category: "mental_state" },
  { id: 25, question: "Does focus regain quickly after small frequency changes?", type: "yesno", category: "mental_state" },
  { id: 26, question: "Do you feel alertness increasing without effort?", type: "yesno", category: "mental_state" },
  { id: 27, question: "Do tones feel emotionally neutral or mood-shaping?", type: "binary", options: ["Neutral", "Mood-shaping"], category: "mental_state" },
  { id: 28, question: "Mental pacing preference: slower, same, or faster?", type: "scale", options: ["Slower", "Same", "Faster"], category: "mental_state" },
  { id: 29, question: "Would you like frequency changes more subtle or noticeable?", type: "binary", options: ["Subtle", "Noticeable"], category: "mental_state" },
  { id: 30, question: "Does the rhythm support long attention spans right now?", type: "yesno", category: "mental_state" },

  // Physiological Proxy Questions (31-40)
  { id: 31, question: "Do you feel heart-beat awareness reducing or unchanged?", type: "binary", options: ["Reducing", "Unchanged"], category: "physiological" },
  { id: 32, question: "Is your body awareness fading comfortably or staying the same?", type: "binary", options: ["Fading", "Same"], category: "physiological" },
  { id: 33, question: "Does your mental relaxation happen suddenly or gradually?", type: "binary", options: ["Suddenly", "Gradually"], category: "physiological" },
  { id: 34, question: "Internal pressure sensation (not diagnostic): rising, reducing, or none?", type: "scale", options: ["Rising", "None", "Reducing"], category: "physiological" },
  { id: 35, question: "Do tones feel like they reduce mental 'noise'?", type: "yesno", category: "physiological" },
  { id: 36, question: "Any jaw or shoulder tension awareness reducing?", type: "yesno", category: "physiological" },
  { id: 37, question: "Do the tones feel mentally \"grounding\"?", type: "yesno", category: "physiological" },
  { id: 38, question: "Do you feel time passing faster or normal while listening?", type: "binary", options: ["Faster", "Normal"], category: "physiological" },
  { id: 39, question: "Do you feel a loop forming in your attention cycle?", type: "yesno", category: "physiological" },
  { id: 40, question: "Session feel right now is more: analytical, emotional, or balanced?", type: "scale", options: ["Analytical", "Balanced", "Emotional"], category: "physiological" },

  // Data-Quality Questions (41-50)
  { id: 41, question: "Are you answering based on feeling or noticing measurable change?", type: "binary", options: ["Feeling", "Measurable"], category: "data_quality" },
  { id: 42, question: "Is this frequency range new for you or familiar?", type: "binary", options: ["New", "Familiar"], category: "data_quality" },
  { id: 43, question: "Would you like this tuning saved as your profile baseline?", type: "yesno", category: "data_quality" },
  { id: 44, question: "Do you feel this frequency band should be recommended to similar users?", type: "yesno", category: "data_quality" },
  { id: 45, question: "Cognitive effect right now feels: mild / moderate / strong?", type: "scale", options: ["Mild", "Moderate", "Strong"], category: "data_quality" },
  { id: 46, question: "How immersive does the sound feel at this moment?", type: "scale", options: ["Low", "Medium", "High"], category: "data_quality" },
  { id: 47, question: "Do harmonic tones help hold you longer than rhythmic beats?", type: "yesno", category: "data_quality" },
  { id: 48, question: "Preference right now is more tone-based or environment-based audio?", type: "binary", options: ["Tone-based", "Environment-based"], category: "data_quality" },
  { id: 49, question: "Would you attend longer if frequencies modulated slower?", type: "yesno", category: "data_quality" },
  { id: 50, question: "Do you feel this audio type supports your mental goal continuously?", type: "yesno", category: "data_quality" },
];

interface SessionSurveyPopupProps {
  isVisible: boolean;
  currentQuestion: typeof SURVEY_QUESTIONS[0] | null;
  onAnswer: (questionId: number, answer: string) => void;
  onSkip: () => void;
  questionNumber: number;
  totalQuestions: number;
}

const SessionSurveyPopup = ({
  isVisible,
  currentQuestion,
  onAnswer,
  onSkip,
  questionNumber,
  totalQuestions,
}: SessionSurveyPopupProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    // Delay to show selection before closing
    setTimeout(() => {
      onAnswer(currentQuestion.id, answer);
      setSelectedAnswer(null);
    }, 300);
  };

  const renderAnswerOptions = () => {
    switch (currentQuestion.type) {
      case 'yesno':
        return (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('Yes')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                selectedAnswer === 'Yes'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#1a1f35]/80 text-[#a9b1d6] hover:bg-[#5b9eff]/20 border border-[#5b9eff]/30'
              }`}
            >
              Yes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('No')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                selectedAnswer === 'No'
                  ? 'bg-red-500 text-white'
                  : 'bg-[#1a1f35]/80 text-[#a9b1d6] hover:bg-[#5b9eff]/20 border border-[#5b9eff]/30'
              }`}
            >
              No
            </motion.button>
          </div>
        );

      case 'binary':
        return (
          <div className="flex gap-2">
            {currentQuestion.options?.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  selectedAnswer === option
                    ? 'bg-[#5b9eff] text-white'
                    : 'bg-[#1a1f35]/80 text-[#a9b1d6] hover:bg-[#5b9eff]/20 border border-[#5b9eff]/30'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="flex gap-1.5">
            {currentQuestion.options?.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                className={`flex-1 py-2 px-2 rounded-lg font-semibold text-xs transition-all ${
                  selectedAnswer === option
                    ? 'bg-[#5b9eff] text-white'
                    : 'bg-[#1a1f35]/80 text-[#a9b1d6] hover:bg-[#5b9eff]/20 border border-[#5b9eff]/30'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Survey Card - Small notification style */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 20 }}
            className="fixed bottom-6 right-6 z-[101] w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-[#1a1f35] to-[#0a0e1a] border-2 border-[#5b9eff]/40 rounded-xl shadow-2xl p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#5b9eff] to-[#7c3aed] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Quick Feedback</h3>
                    <p className="text-[10px] text-[#a9b1d6]">
                      {questionNumber} of {totalQuestions}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onSkip}
                  className="text-[#a9b1d6] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-[#1a1f35] rounded-full mb-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#5b9eff] to-[#7c3aed]"
                />
              </div>

              {/* Question */}
              <div className="mb-3">
                <p className="text-sm text-white font-medium leading-snug">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                {renderAnswerOptions()}
                
                {/* Skip Button */}
                <button
                  onClick={onSkip}
                  className="w-full py-1.5 text-xs text-[#a9b1d6] hover:text-white transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionSurveyPopup;
export { SURVEY_QUESTIONS };
