/**
 * Adaptive Response Generator
 * Simulates ML-driven personalization without backend
 * Uses time-of-day and query history for dynamic responses
 */

export interface AdaptiveResponse {
  content: string;
  confidence: number;
  recommendedTrack: string;
  frequency: string;
  duration: string;
  scientific: string;
  category: 'focus' | 'sleep' | 'relaxation' | 'creativity' | 'energy';
  reasoning: string[];
}

interface QueryContext {
  persona: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  previousQueries: string[];
  sessionCount: number;
}

// Track query history in memory
const queryHistory: string[] = [];
const MAX_HISTORY = 10;

/**
 * Get current context for adaptive responses
 */
function getContext(): QueryContext {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay: QueryContext['timeOfDay'];
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  let sessionCount = 0;
  if (typeof window !== 'undefined') {
    try {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      sessionCount = sessions.length;
    } catch (e) {
      sessionCount = 0;
    }
  }

  return {
    persona: 'User',
    timeOfDay,
    previousQueries: [...queryHistory],
    sessionCount,
  };
}

/**
 * Add query to history
 */
function addToHistory(query: string) {
  queryHistory.push(query);
  if (queryHistory.length > MAX_HISTORY) {
    queryHistory.shift();
  }
}



/**
 * Generate dynamic confidence score with animation stages
 */
export function generateConfidence(
  baseConfidence: number,
  context: QueryContext
): number[] {
  // Simulate ML confidence building: start lower, increase to final
  const historyBoost = Math.min(context.previousQueries.length * 2, 8);
  const timeBoost = context.timeOfDay === 'morning' ? 3 : context.timeOfDay === 'evening' ? 2 : 0;
  
  const finalConfidence = Math.min(
    baseConfidence + historyBoost + timeBoost,
    98
  );

  // Return 3 stages for animated confidence badge
  return [
    Math.max(finalConfidence - 15, 65),
    Math.max(finalConfidence - 7, 72),
    finalConfidence,
  ];
}

/**
 * Generate varied phrasing for the same recommendation
 */
function getVariedPhrasing(
  trackName: string,
  category: string,
  variation: number
): { intro: string; recommendation: string } {
  const intros = [
    `🎯 **AI Recommendation: ${trackName}**`,
    `✨ **Perfect Match: ${trackName}**`,
    `🧠 **Optimized for You: ${trackName}**`,
    `💡 **Smart Suggestion: ${trackName}**`,
  ];

  const recommendations = {
    focus: [
      'I recommend using',
      'For maximum concentration, try',
      'Based on your goals, I suggest',
      'To enhance your focus, use',
    ],
    sleep: [
      'I recommend starting with',
      'For deep restorative sleep, try',
      'To improve sleep quality, use',
      'Based on sleep science, I suggest',
    ],
    relaxation: [
      'I recommend trying',
      'For stress relief, use',
      'To calm your mind, try',
      'Based on your needs, I suggest',
    ],
    creativity: [
      'I recommend exploring',
      'For creative breakthroughs, try',
      'To unlock your creativity, use',
      'Based on flow state research, I suggest',
    ],
    energy: [
      'I recommend boosting with',
      'For sustained energy, try',
      'To feel more alert, use',
      'Based on your energy needs, I suggest',
    ],
  };

  const categoryRecs = recommendations[category as keyof typeof recommendations] || recommendations.focus;
  
  return {
    intro: intros[variation % intros.length],
    recommendation: categoryRecs[variation % categoryRecs.length],
  };
}

/**
 * Generate persona-aware tips
 */
function getPersonaTips(
  personaName: string,
  category: string,
  variation: number
): string[] {
  
  const tipSets = {
    focus: [
      [
        '✓ Use Pomodoro technique (25 min work + 5 min break)',
        '✓ Minimize distractions (phone on silent)',
        '✓ Combine with minimal ambient noise',
      ],
      [
        '✓ Start sessions during your peak energy hours',
        '✓ Keep a focus log to track improvements',
        '✓ Pair with caffeine 30 minutes before',
      ],
      [
        '✓ Close eyes for first 2 minutes to enhance entrainment',
        '✓ Gradually increase session duration over 7 days',
        '✓ Use during deep work blocks',
      ],
    ],
    sleep: [
      [
        '✓ Start 30 minutes before desired sleep time',
        '✓ Keep volume low (20-30%)',
        '✓ Combine with cool room temperature (65-68°F)',
      ],
      [
        '✓ Create a consistent bedtime routine',
        '✓ Avoid screens 1 hour before sleep',
        '✓ Use blackout curtains for optimal results',
      ],
      [
        '✓ Try 4-7-8 breathing before sleep',
        '✓ Keep room temperature between 65-68°F',
        '✓ Consistency is key - use nightly for best results',
      ],
    ],
    relaxation: [
      [
        '✓ Use during breaks or after stressful events',
        '✓ Combine with deep breathing (4-7-8 technique)',
        '✓ Close eyes and focus on breath',
      ],
      [
        '✓ Practice progressive muscle relaxation',
        '✓ Use in a quiet, comfortable space',
        '✓ Can be used multiple times daily',
      ],
      [
        '✓ Combine with aromatherapy (lavender)',
        '✓ Practice mindful body scanning',
        '✓ Release tension from jaw and shoulders',
      ],
    ],
    creativity: [
      [
        '✓ Use during brainstorming or artistic work',
        '✓ Keep pen/paper nearby to capture ideas',
        '✓ Allow mind to wander freely',
      ],
      [
        '✓ Best results when well-rested',
        '✓ Try during creative blocks',
        '✓ Combine with free-writing exercises',
      ],
      [
        '✓ Use during morning creative sessions',
        '✓ Pair with visual inspiration boards',
        '✓ Let associations flow without judgment',
      ],
    ],
    energy: [
      [
        '✓ Use during afternoon energy slumps',
        '✓ Combine with brief physical movement',
        '✓ Stay hydrated for best results',
      ],
      [
        '✓ Pair with cold water and natural light',
        '✓ Use before important meetings',
        '✓ Take breaks every 90 minutes',
      ],
      [
        '✓ Stand up and stretch before session',
        '✓ Open windows for fresh air',
        '✓ Use morning or early afternoon',
      ],
    ],
  };

  const categoryTips = tipSets[category as keyof typeof tipSets] || tipSets.focus;
  
  const selectedTips = categoryTips[variation % categoryTips.length];
  return selectedTips;
}

/**
 * Get time-aware duration recommendation
 */
function getTimedDuration(category: string, timeOfDay: string): string {
  if (category === 'focus') {
    return timeOfDay === 'morning' ? '25-45 minutes' : '15-30 minutes';
  }
  if (category === 'sleep') {
    return timeOfDay === 'night' || timeOfDay === 'evening' ? '30-60 minutes' : '20-40 minutes';
  }
  if (category === 'energy') {
    return timeOfDay === 'morning' ? '10-20 minutes' : '15-25 minutes';
  }
  return '15-30 minutes';
}

/**
 * Generate reasoning array for transparency
 */
function generateReasoning(
  category: string,
  context: QueryContext,
  isRepeatQuery: boolean
): string[] {
  const reasons = [];
  
  if (context.timeOfDay === 'morning' && category === 'focus') {
    reasons.push('Optimal for morning peak productivity');
  } else if (context.timeOfDay === 'evening' && category === 'relaxation') {
    reasons.push('Perfect for evening wind-down');
  } else if (context.timeOfDay === 'night' && category === 'sleep') {
    reasons.push('Ideal for nighttime sleep preparation');
  }
  
  if (context.sessionCount > 5) {
    reasons.push('Based on your session history');
  }
  
  if (isRepeatQuery) {
    reasons.push('Adapting to your repeated interest');
  }
  
  reasons.push('Backed by neuroscience research');
  
  return reasons;
}

/**
 * Get varied emoji for emphasis
 */
function getRandomEmoji(category: string): string {
  const emojiSets = {
    focus: ['🎯', '💡', '🧠', '⚡'],
    sleep: ['😴', '🌙', '💤', '🛌'],
    relaxation: ['🧘', '☮️', '🌿', '🕊️'],
    creativity: ['🎨', '✨', '💫', '🌈'],
    energy: ['⚡', '🔋', '🌟', '🚀'],
  };
  
  const emojis = emojiSets[category as keyof typeof emojiSets] || emojiSets.focus;
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Main adaptive response generator
 */
export function generateAdaptiveResponse(userInput: string): AdaptiveResponse {
  const context = getContext();
  const input = userInput.toLowerCase();
  
  // Check if repeat query
  const isRepeatQuery = context.previousQueries.some(q => 
    q.toLowerCase().includes(input.split(' ')[0])
  );
  
  // Determine variation based on history
  const variation = context.previousQueries.length;
  
  // Add to history
  addToHistory(userInput);

  // Focus/Concentration
  if (input.includes('focus') || input.includes('concentrate') || input.includes('work') || input.includes('study')) {
    const category = 'focus';
    const trackName = 'Deep Focus Alpha';
    const phrasing = getVariedPhrasing(trackName, category, variation);
    const emoji = getRandomEmoji(category);
    const duration = getTimedDuration(category, context.timeOfDay);
    const tips = getPersonaTips(context.persona, category, variation);
    const reasoning = generateReasoning(category, context, isRepeatQuery);

    const content = `${emoji} ${phrasing.intro}

${phrasing.recommendation} **${trackName}** to enhance your concentration and mental clarity.

**Recommended Track:** ${trackName}
**Frequency:** 10 Hz (Alpha Waves)
**Optimal Duration:** ${duration}

**Scientific Basis:**
Alpha waves (8-12 Hz) enhance sustained attention and working memory. Research by Klimesch et al. (2007) shows alpha oscillations facilitate top-down cognitive control during learning tasks.

**Why this works:**
• Synchronizes prefrontal cortex activity
• Maintains alertness while reducing mental fatigue  
• Optimal for tasks requiring sustained concentration
• Enhances neural efficiency in attention networks

**Session Tips:**
${tips.join('\n')}`;

    return {
      content,
      confidence: 87,
      recommendedTrack: trackName,
      frequency: 'Alpha (10 Hz)',
      duration,
      scientific: 'Klimesch et al. (2007) - Alpha oscillations and cognitive control',
      category,
      reasoning,
    };
  }

  // Sleep
  if (input.includes('sleep') || input.includes('rest') || input.includes('insomnia') || input.includes('tired')) {
    const category = 'sleep';
    const trackName = isRepeatQuery && variation % 2 === 1 ? 'Lucid Dream Theta' : 'Deep Sleep Delta';
    const phrasing = getVariedPhrasing(trackName, category, variation);
    const emoji = getRandomEmoji(category);
    const duration = getTimedDuration(category, context.timeOfDay);
    const tips = getPersonaTips(context.persona, category, variation);
    const reasoning = generateReasoning(category, context, isRepeatQuery);

    const freq = trackName === 'Deep Sleep Delta' ? '2 Hz (Delta Waves)' : '5 Hz (Theta Waves)';
    const scientific = trackName === 'Deep Sleep Delta' 
      ? 'Dang-Vu et al. (2008) - Delta oscillations in sleep consolidation'
      : 'Cordi et al. (2019) - Theta oscillations and sleep quality';

    const content = `${emoji} ${phrasing.intro}

${phrasing.recommendation} **${trackName}** for deep, restorative sleep and relaxation.

**Recommended Track:** ${trackName}
**Frequency:** ${freq}
**Optimal Duration:** ${duration}

**Scientific Basis:**
${trackName === 'Deep Sleep Delta' 
  ? 'Delta waves (0.5-4 Hz) are the signature of deep NREM sleep. Studies by Dang-Vu et al. (2008) demonstrate delta oscillations promote memory consolidation and physical restoration.'
  : 'Theta waves (4-8 Hz) during sleep facilitate memory integration. Research by Cordi et al. (2019) shows theta enhancement improves sleep quality and next-day cognitive performance.'}

**Why this works:**
• ${trackName === 'Deep Sleep Delta' ? 'Mimics natural slow-wave sleep patterns' : 'Facilitates REM and deep sleep transitions'}
• Reduces cortisol (stress hormone) levels
• Enhances parasympathetic nervous system activity
• Promotes physical and mental restoration

**Session Tips:**
${tips.join('\n')}`;

    return {
      content,
      confidence: trackName === 'Deep Sleep Delta' ? 92 : 88,
      recommendedTrack: trackName,
      frequency: freq,
      duration,
      scientific,
      category,
      reasoning,
    };
  }

  // Stress/Relaxation
  if (input.includes('stress') || input.includes('anxiety') || input.includes('calm') || input.includes('relax')) {
    const category = 'relaxation';
    const trackName = 'Relaxation Theta';
    const phrasing = getVariedPhrasing(trackName, category, variation);
    const emoji = getRandomEmoji(category);
    const duration = getTimedDuration(category, context.timeOfDay);
    const tips = getPersonaTips(context.persona, category, variation);
    const reasoning = generateReasoning(category, context, isRepeatQuery);

    const content = `${emoji} ${phrasing.intro}

${phrasing.recommendation} **${trackName}** to reduce stress and restore inner calm.

**Recommended Track:** ${trackName}
**Frequency:** 6 Hz (Theta Waves)
**Optimal Duration:** ${duration}

**Scientific Basis:**
Theta waves (4-8 Hz) activate the default mode network, promoting introspection and emotional regulation. Wahbeh et al. (2007) found theta induction reduces anxiety and improves mood states significantly.

**Why this works:**
• Reduces amygdala reactivity (fear/stress center)
• Increases GABA production (calming neurotransmitter)
• Promotes mindful present-moment awareness
• Lowers heart rate and blood pressure naturally

**Session Tips:**
${tips.join('\n')}`;

    return {
      content,
      confidence: 84,
      recommendedTrack: trackName,
      frequency: 'Theta (6 Hz)',
      duration,
      scientific: 'Wahbeh et al. (2007) - Theta waves and anxiety reduction',
      category,
      reasoning,
    };
  }

  // Creativity
  if (input.includes('creat') || input.includes('idea') || input.includes('inspiration') || input.includes('imagination')) {
    const category = 'creativity';
    const trackName = 'Creative Surge Theta';
    const phrasing = getVariedPhrasing(trackName, category, variation);
    const emoji = getRandomEmoji(category);
    const duration = getTimedDuration(category, context.timeOfDay);
    const tips = getPersonaTips(context.persona, category, variation);
    const reasoning = generateReasoning(category, context, isRepeatQuery);

    const content = `${emoji} ${phrasing.intro}

${phrasing.recommendation} **${trackName}** to unlock creative insights and innovative thinking.

**Recommended Track:** ${trackName}
**Frequency:** 7 Hz (Theta Waves)
**Optimal Duration:** ${duration}

**Scientific Basis:**
Theta waves (4-8 Hz) are strongly associated with creative insight and divergent thinking. Fink & Benedek (2014) found increased theta power during creative ideation tasks and novel problem-solving.

**Why this works:**
• Facilitates access to subconscious associations
• Reduces left-brain analytical filtering
• Enhances right-hemisphere holistic processing
• Promotes 'flow state' (Csikszentmihalyi, 1990)

**Session Tips:**
${tips.join('\n')}`;

    return {
      content,
      confidence: 79,
      recommendedTrack: trackName,
      frequency: 'Theta (7 Hz)',
      duration,
      scientific: 'Fink & Benedek (2014) - Theta waves in creative cognition',
      category,
      reasoning,
    };
  }

  // Energy/Alertness
  if (input.includes('energy') || input.includes('alert') || input.includes('awake') || input.includes('tired')) {
    const category = 'energy';
    const trackName = 'Energy Boost Beta';
    const phrasing = getVariedPhrasing(trackName, category, variation);
    const emoji = getRandomEmoji(category);
    const duration = getTimedDuration(category, context.timeOfDay);
    const tips = getPersonaTips(context.persona, category, variation);
    const reasoning = generateReasoning(category, context, isRepeatQuery);

    const content = `${emoji} ${phrasing.intro}

${phrasing.recommendation} **${trackName}** for sustained energy and mental alertness.

**Recommended Track:** ${trackName}
**Frequency:** 20 Hz (Beta Waves)
**Optimal Duration:** ${duration}

**Scientific Basis:**
Beta waves (12-30 Hz) are associated with active thinking and heightened alertness. Research by Egner & Gruzelier (2004) shows beta training improves sustained attention and processing speed.

**Why this works:**
• Increases cortical arousal and wakefulness
• Enhances cognitive processing speed
• Improves reaction time and decision-making
• Boosts motivation and goal-directed behavior

**Session Tips:**
${tips.join('\n')}`;

    return {
      content,
      confidence: 81,
      recommendedTrack: trackName,
      frequency: 'Beta (20 Hz)',
      duration,
      scientific: 'Egner & Gruzelier (2004) - Beta training and cognitive performance',
      category,
      reasoning,
    };
  }

  // Default response
  const emoji = '🎵';
  return {
    content: `${emoji} **How can I help you today?**

I can provide personalized binaural beat recommendations for:

🎯 **Focus & Concentration** - Deep work, studying, productivity
😴 **Better Sleep** - Falling asleep faster, deeper rest
🧘 **Stress Relief** - Anxiety reduction, relaxation
🎨 **Creativity** - Brainstorming, artistic flow
⚡ **Energy Boost** - Mental alertness, fighting fatigue

What would you like to optimize today?`,
    confidence: 95,
    recommendedTrack: '',
    frequency: '',
    duration: '',
    scientific: '',
    category: 'focus',
    reasoning: ['Interactive knowledge base', 'Science-backed recommendations'],
  };
}

/**
 * Get category color for UI gradients
 */
export function getCategoryColor(category: string): string {
  const colors = {
    focus: 'from-blue-500 to-cyan-500',
    sleep: 'from-purple-500 to-indigo-600',
    relaxation: 'from-green-500 to-emerald-500',
    creativity: 'from-yellow-500 to-orange-500',
    energy: 'from-red-500 to-pink-500',
  };
  return colors[category as keyof typeof colors] || colors.focus;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const icons = {
    focus: '🎯',
    sleep: '😴',
    relaxation: '🧘',
    creativity: '🎨',
    energy: '⚡',
  };
  return icons[category as keyof typeof icons] || '🎵';
}
