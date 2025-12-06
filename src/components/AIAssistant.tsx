'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  generateAdaptiveResponse,
  generateConfidence,
  getCategoryColor,
  getCategoryIcon,
  type AdaptiveResponse,
} from '@/utils/adaptiveResponseGenerator';

interface AIAssistantProps {
  onRecommendation?: (trackIndex: number) => void;
  autoOpen?: boolean; // For demo mode auto-open
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  confidence?: number; // 0-100
  confidenceStages?: number[]; // For animated confidence
  recommendedTrack?: string;
  frequency?: string;
  duration?: string;
  scientific?: string;
  category?: 'focus' | 'sleep' | 'relaxation' | 'creativity' | 'energy';
  reasoning?: string[];
}

const AIAssistant = ({ autoOpen = false }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [animatingConfidence, setAnimatingConfidence] = useState<string | null>(null);
  const [currentConfidence, setCurrentConfidence] = useState<{ [key: string]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize with greeting
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const greeting = "Hi! I'm your Harmony AI assistant. 🎵\n\nI can help you choose the perfect binaural beats for:\n\n🎯 Focus & Concentration\n😴 Better Sleep\n🧘 Stress Relief & Relaxation\n🎨 Creativity & Flow\n⚡ Energy & Alertness\n\nWhat would you like help with today?";
      
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: greeting,
          createdAt: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Animate confidence badge through stages
  const animateConfidenceBadge = (messageId: string, stages: number[]) => {
    // Stage 1: Initial confidence
    setCurrentConfidence(prev => ({ ...prev, [messageId]: stages[0] }));
    
    // Stage 2: Mid-building
    setTimeout(() => {
      setCurrentConfidence(prev => ({ ...prev, [messageId]: stages[1] }));
    }, 200);
    
    // Stage 3: Final confidence
    setTimeout(() => {
      setCurrentConfidence(prev => ({ ...prev, [messageId]: stages[2] }));
      setTimeout(() => {
        setAnimatingConfidence(null);
      }, 300);
    }, 400);
  };

  // Adaptive AI response with ML-like features
  const getAdaptiveAIResponse = (userInput: string): AIMessage => {
    const response: AdaptiveResponse = generateAdaptiveResponse(userInput);
    const baseId = (Date.now() + 1).toString();
    
    // Generate confidence stages for animation
    const confidenceStages = generateConfidence(response.confidence, {
      persona: 'User',
      timeOfDay: new Date().getHours() >= 5 && new Date().getHours() < 12 ? 'morning' :
                 new Date().getHours() >= 12 && new Date().getHours() < 17 ? 'afternoon' :
                 new Date().getHours() >= 17 && new Date().getHours() < 21 ? 'evening' : 'night',
      previousQueries: [],
      sessionCount: 0,
    });

    return {
      id: baseId,
      role: 'assistant',
      content: response.content,
      createdAt: new Date(),
      confidence: response.confidence,
      confidenceStages,
      recommendedTrack: response.recommendedTrack,
      frequency: response.frequency,
      duration: response.duration,
      scientific: response.scientific,
      category: response.category,
      reasoning: response.reasoning,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // Realistic typing delay (0.8-1.5 seconds)
    const typingDelay = 800 + Math.random() * 700;
    
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = getAdaptiveAIResponse(userInput);
      setMessages(prev => [...prev, aiResponse]);
      
      // Animate confidence badge if present
      if (aiResponse.confidence && aiResponse.confidenceStages) {
        setAnimatingConfidence(aiResponse.id);
        animateConfidenceBadge(aiResponse.id, aiResponse.confidenceStages);
      }
      
      setIsLoading(false);
    }, typingDelay);
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

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // Realistic typing delay
    const typingDelay = 800 + Math.random() * 700;
    
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = getAdaptiveAIResponse(prompt);
      setMessages(prev => [...prev, aiResponse]);
      
      // Animate confidence badge if present
      if (aiResponse.confidence && aiResponse.confidenceStages) {
        setAnimatingConfidence(aiResponse.id);
        animateConfidenceBadge(aiResponse.id, aiResponse.confidenceStages);
      }
      
      setIsLoading(false);
    }, typingDelay);
  };

  return (
    <>
      {/* Floating Button - AI Assistant - HIGHEST POSITION */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] text-white rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 items-center justify-center group touch-manipulation"
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          width: '64px',
          height: '64px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        initial={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open AI chat assistant"
        title="AI Assistant"
      >
        <svg className="w-15 h-15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          )}
        </svg>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute right-full mr-3 whitespace-nowrap bg-[#1a1f35] text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AI Chat Assistant
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-[260px] sm:bottom-[280px] right-4 sm:right-8 z-[10000] w-[calc(100vw-2rem)] sm:w-96 max-w-[calc(100vw-2rem)] h-[calc(100vh-18rem)] sm:h-[500px] max-h-[calc(100vh-20rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                {messages.map((message, index: number) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm transition-all ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] text-white shadow-lg'
                          : message.category
                          ? `bg-gradient-to-br ${getCategoryColor(message.category)}/10 text-white border border-${message.category === 'focus' ? '[#7aa2f7]' : message.category === 'sleep' ? 'purple-500' : message.category === 'relaxation' ? 'green-500' : message.category === 'creativity' ? 'yellow-500' : 'red-500'}/30`
                          : 'bg-[#1a1f35]/80 text-white border border-[#7aa2f7]/20'
                      }`}
                    >
                      {/* Confidence Badge for AI messages with animation */}
                      {message.role === 'assistant' && message.confidence && (
                        <motion.div 
                          className="flex flex-wrap items-center gap-2 mb-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div 
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 relative ${
                              (currentConfidence[message.id] || message.confidence) >= 85 ? 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20' :
                              (currentConfidence[message.id] || message.confidence) >= 70 ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20' :
                              'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
                            }`}
                            animate={{
                              scale: animatingConfidence === message.id ? [1, 1.08, 1] : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                          >
                            {/* Shimmer effect for adaptive AI */}
                            {animatingConfidence === message.id && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ duration: 1, repeat: 2 }}
                              />
                            )}
                            <motion.svg 
                              className="w-3 h-3" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              animate={animatingConfidence === message.id ? { rotate: 360 } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </motion.svg>
                            <span>{currentConfidence[message.id] || message.confidence}% Confidence</span>
                          </motion.div>
                          
                          {/* Category icon with pulse */}
                          {message.category && message.recommendedTrack && (
                            <>
                              <motion.div 
                                className="px-2 py-1 bg-[#7aa2f7]/20 text-[#7aa2f7] rounded-full text-xs font-medium flex items-center space-x-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                              >
                                <motion.span
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: 2, delay: 0.6 }}
                                >
                                  {getCategoryIcon(message.category)}
                                </motion.span>
                                <span>{message.recommendedTrack}</span>
                              </motion.div>
                            </>
                          )}
                        </motion.div>
                      )}
                      
                      {/* AI Reasoning (transparency) */}
                      {message.role === 'assistant' && message.reasoning && message.reasoning.length > 0 && (
                        <motion.div 
                          className="mb-3 flex flex-wrap gap-1.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {message.reasoning.map((reason, idx) => (
                            <motion.span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-[#7aa2f7]/10 text-[#7aa2f7] rounded-full border border-[#7aa2f7]/20"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + idx * 0.1 }}
                            >
                              {reason}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                      
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      
                      {/* Scientific metadata */}
                      {message.role === 'assistant' && (message.frequency || message.duration) && (
                        <div className="mt-3 pt-3 border-t border-[#7aa2f7]/10 space-y-1">
                          {message.frequency && (
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                              <span>{message.frequency}</span>
                            </div>
                          )}
                          {message.duration && (
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{message.duration}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="bg-[#1a1f35]/80 p-4 rounded-2xl border border-[#7aa2f7]/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2.5 h-2.5 bg-[#7aa2f7] rounded-full shadow-lg shadow-[#7aa2f7]/50"
                              animate={{ 
                                scale: [1, 1.4, 1], 
                                opacity: [0.4, 1, 0.4],
                                y: [0, -4, 0]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 0.9, 
                                delay: i * 0.15,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
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