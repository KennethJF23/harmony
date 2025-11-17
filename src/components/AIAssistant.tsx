'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AIAssistantProps {
  onRecommendation?: (trackIndex: number) => void;
}

const AIAssistant = ({ onRecommendation }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string; role: string; content: string; createdAt: Date}>>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your Harmony AI assistant. 🎵\n\nI can help you choose the perfect binaural beats for:\n\n🎯 Focus & Concentration\n😴 Better Sleep\n🧘 Stress Relief & Relaxation\n🎨 Creativity & Flow\n⚡ Energy & Alertness\n\nWhat would you like help with today?",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const knowledgeBase = {
    focus: "For optimal focus and concentration, I recommend:\n\n🎯 Deep Focus Alpha (8-12 Hz): Best for sustained attention and learning. This frequency range helps you maintain alertness while staying calm.\n\n⚡ Beta Waves (14-30 Hz): Perfect for active thinking, problem-solving, and mental clarity during work sessions.\n\n💡 Try the 'Deep Focus Alpha' track for 25-50 minute sessions with short breaks.",
    
    sleep: "For better sleep quality, use:\n\n🌙 Delta Waves (0.5-4 Hz): The deepest sleep frequency. Promotes restorative rest and physical healing.\n\n😴 Theta Waves (4-8 Hz): Great for falling asleep and entering light sleep stages. Reduces anxiety and mental chatter.\n\n🎵 Start with 'Deep Sleep Delta' 30 minutes before bed. Let it continue playing as you fall asleep.",
    
    stress: "To reduce stress and anxiety:\n\n🧘 Alpha Waves (8-12 Hz): Creates a calm, relaxed yet alert state. Perfect for meditation and stress relief.\n\n💆 Theta Waves (4-8 Hz): Deep relaxation, reduces mental tension, and promotes emotional healing.\n\n🎶 Use 'Relaxation Theta' during breaks or after stressful activities for 15-20 minutes.",
    
    creativity: "To boost creativity:\n\n🎨 Theta Waves (4-8 Hz): The creative frequency! Enhances imagination, intuition, and artistic thinking.\n\n✨ Alpha-Theta Border (7-8 Hz): The 'flow state' where ideas flow naturally and creative insights emerge.\n\n🎭 Try 'Creative Surge Theta' when brainstorming or working on creative projects.",
    
    meditation: "For meditation practice:\n\n🧘 Alpha Waves (8-12 Hz): Ideal for mindful meditation, present-moment awareness.\n\n🙏 Theta Waves (4-8 Hz): Deep meditative states, spiritual connection, and inner peace.\n\n🌟 Use 'Relaxation Theta' for meditation sessions of 20+ minutes.",
    
    energy: "To boost energy and alertness:\n\n⚡ Beta Waves (15-30 Hz): Increases alertness, motivation, and mental energy.\n\n☕ Low Gamma (30-40 Hz): Peak focus and cognitive performance.\n\n💪 Try 'Deep Focus Alpha' or any Beta wave track for an energy boost without caffeine!",
    
    general: "Welcome to Harmony! 🎵\n\nI can help you choose the right binaural beats for your goals:\n\n🎯 Focus & Concentration → Alpha/Beta waves\n😴 Sleep & Rest → Delta/Theta waves\n🧘 Relaxation & Meditation → Alpha/Theta waves\n🎨 Creativity & Flow → Theta waves\n⚡ Energy & Alertness → Beta waves\n\nOur tracks use scientifically-proven frequencies that influence your brainwave patterns. Just choose your goal and let the sound guide your mind!\n\nWhat would you like help with today?"
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('focus') || input.includes('concentrate') || input.includes('work') || input.includes('study')) {
      return knowledgeBase.focus;
    }
    if (input.includes('sleep') || input.includes('rest') || input.includes('insomnia') || input.includes('tired')) {
      return knowledgeBase.sleep;
    }
    if (input.includes('stress') || input.includes('anxiety') || input.includes('calm') || input.includes('relax')) {
      return knowledgeBase.stress;
    }
    if (input.includes('creat') || input.includes('idea') || input.includes('inspiration') || input.includes('imagination')) {
      return knowledgeBase.creativity;
    }
    if (input.includes('meditat') || input.includes('mindful') || input.includes('zen')) {
      return knowledgeBase.meditation;
    }
    if (input.includes('energy') || input.includes('alert') || input.includes('wake') || input.includes('active')) {
      return knowledgeBase.energy;
    }
    if (input.includes('how') || input.includes('what') || input.includes('work') || input.includes('help') || input.includes('?')) {
      return knowledgeBase.general;
    }
    
    return knowledgeBase.general;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = getResponse(userInput);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        createdAt: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const quickPrompts = [
    {text: 'Help me focus', prompt: 'I need help focusing on work. What binaural beat frequency should I use?' },
    {text: 'Better sleep', prompt: 'I want to improve my sleep quality. What frequencies work best?' },
    {text: 'Reduce stress', prompt: 'I need to relax and reduce stress. What do you recommend?' },
    {text: 'Be creative', prompt: 'I want to boost my creativity. Which brainwave state should I aim for?' },
  ];

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = getResponse(prompt);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Button - MIDDLE POSITION (bottom-21) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-21 right-8 w-12 h-12 bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          )}
        </svg>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 whitespace-nowrap bg-[#1a1f35] text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AI Chat Assistant
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-[140px] right-8 z-50 w-96 max-w-[calc(100vw-4rem)] h-[500px] max-h-[calc(100vh-10rem)]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[#1a1f35]/95 backdrop-blur-2xl rounded-3xl border border-[#7aa2f7]/20 shadow-2xl h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-[#7aa2f7]/10 bg-gradient-to-r from-[#7aa2f7]/10 to-[#bb9af7]/10 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <svg className="w-6 h-6 text-[#7aa2f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>AI Assistant</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Local Knowledge Base</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-[#7aa2f7]/20 rounded-lg transition-colors text-gray-400 hover:text-[#7aa2f7]"
                  title="Minimize"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message: {id: string; role: string; content: string; createdAt: Date}, index: number) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] text-white shadow-lg'
                          : 'bg-[#1a1f35]/80 text-white border border-[#7aa2f7]/20'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-[#1a1f35]/80 p-4 rounded-2xl border border-[#7aa2f7]/20">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[#7aa2f7] rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Prompts */}
              {messages.length === 1 && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-400 mb-3">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt.prompt)}
                        className="p-3 bg-[#1a1f35]/50 hover:bg-[#1a1f35] border border-[#7aa2f7]/20 hover:border-[#7aa2f7]/40 rounded-xl text-xs font-medium text-white transition-all"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {prompt.text}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-[#7aa2f7]/20 bg-[#1a1f35]/40">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 bg-[#0a0e1a]/60 border border-[#7aa2f7]/30 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#7aa2f7]/60 focus:ring-2 focus:ring-[#7aa2f7]/20 transition-all"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#7aa2f7]/30 hover:shadow-xl transition-all"
                    whileHover={{ scale: input.trim() && !isLoading ? 1.05 : 1 }}
                    whileTap={{ scale: input.trim() && !isLoading ? 0.95 : 1 }}
                  >
                    Send
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;