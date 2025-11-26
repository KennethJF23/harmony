/**
 * Demo Data for Hackathon Presentation
 * Prepopulates the app with synthetic session data for impressive first-load experience
 * All personas are scientifically plausible and demonstrate AI capabilities
 */

export interface DemoPersona {
  name: string;
  goal: 'focus' | 'sleep' | 'stress' | 'creativity' | 'meditation';
  sessions: Array<{
    trackId: number;
    duration: number; // minutes
    mood: number; // 1-5
    productivity: number; // 1-5
    timestamp: Date;
    goal: string;
  }>;
  preferences: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    avgSessionLength: number;
    favoriteFrequency: string;
  };
}

// Define demo personas
export const DEMO_PERSONAS: DemoPersona[] = [
  {
    name: 'Alex Chen',
    goal: 'focus',
    preferences: {
      timeOfDay: 'morning',
      avgSessionLength: 45,
      favoriteFrequency: 'Alpha',
    },
    sessions: [], // Will be populated below
  },
  {
    name: 'Maya Patel',
    goal: 'creativity',
    preferences: {
      timeOfDay: 'afternoon',
      avgSessionLength: 30,
      favoriteFrequency: 'Theta',
    },
    sessions: [],
  },
  {
    name: 'Jordan Night',
    goal: 'sleep',
    preferences: {
      timeOfDay: 'night',
      avgSessionLength: 60,
      favoriteFrequency: 'Delta',
    },
    sessions: [],
  },
];

// Generate realistic session data for past 21 days
export function generateDemoSessions(persona: DemoPersona): void {
  const now = new Date();
  const tracks = [
    { id: 0, name: 'Deep Focus Alpha', category: 'focus', frequency: 'Alpha' },
    { id: 1, name: 'Beta Concentration', category: 'focus', frequency: 'Beta' },
    { id: 2, name: 'Deep Sleep Delta', category: 'sleep', frequency: 'Delta' },
    { id: 3, name: 'Theta Dreams', category: 'sleep', frequency: 'Theta' },
    { id: 4, name: 'Relaxation Theta', category: 'stress', frequency: 'Theta' },
    { id: 5, name: 'Alpha Calm', category: 'stress', frequency: 'Alpha' },
    { id: 6, name: 'Creative Surge Theta', category: 'creativity', frequency: 'Theta' },
    { id: 7, name: 'Gamma Burst', category: 'energy', frequency: 'Gamma' },
  ];

  // Generate 15-25 sessions over 21 days with realistic patterns
  const sessionCount = 15 + Math.floor(Math.random() * 10);
  const goalTracks = tracks.filter(t => t.category === persona.goal || Math.random() > 0.7);

  for (let i = 0; i < sessionCount; i++) {
    const daysAgo = Math.floor(Math.random() * 21);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Adjust hour based on persona preference
    const hourMap = {
      morning: 6 + Math.floor(Math.random() * 4), // 6-10 AM
      afternoon: 13 + Math.floor(Math.random() * 4), // 1-5 PM
      evening: 18 + Math.floor(Math.random() * 3), // 6-9 PM
      night: 22 + Math.floor(Math.random() * 3), // 10 PM-1 AM
    };
    timestamp.setHours(hourMap[persona.preferences.timeOfDay]);
    timestamp.setMinutes(Math.floor(Math.random() * 60));

    // Select track (70% from preferred goal, 30% exploration)
    const track = Math.random() < 0.7 
      ? goalTracks[Math.floor(Math.random() * goalTracks.length)]
      : tracks[Math.floor(Math.random() * tracks.length)];

    // Duration: persona avg ± 20 minutes
    const duration = persona.preferences.avgSessionLength + (Math.random() - 0.5) * 40;

    // Mood/productivity: better for preferred frequency (3.5-5), lower for others (2-4)
    const isPreferred = track.frequency === persona.preferences.favoriteFrequency;
    const moodBase = isPreferred ? 3.5 : 2;
    const moodRange = isPreferred ? 1.5 : 2;
    const mood = Math.min(5, Math.max(1, Math.round(moodBase + Math.random() * moodRange)));
    const productivity = Math.min(5, Math.max(1, Math.round(moodBase + Math.random() * moodRange)));

    persona.sessions.push({
      trackId: track.id,
      duration: Math.max(5, Math.round(duration)),
      mood,
      productivity,
      timestamp,
      goal: persona.goal,
    });
  }

  // Sort by timestamp (oldest first)
  persona.sessions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Initialize demo data
DEMO_PERSONAS.forEach(generateDemoSessions);

// Export selected persona (can be changed based on demo scenario)
export const ACTIVE_DEMO_PERSONA = DEMO_PERSONAS[0]; // Alex Chen by default

/**
 * Load demo data into localStorage
 * Call this on first load or via demo mode toggle
 */
export function loadDemoData(personaIndex: number = 0): void {
  if (typeof window === 'undefined') return;
  
  const persona = DEMO_PERSONAS[personaIndex];
  
  // Training data for ML
  const trainingData = persona.sessions.map(session => ({
    ...session,
    timestamp: session.timestamp.toISOString(),
    energy: Math.min(5, Math.max(1, Math.round(session.productivity + (Math.random() - 0.5)))),
    notes: '',
  }));

  // User stats
  const stats = {
    totalSessions: persona.sessions.length,
    completedSessions: persona.sessions.length,
    totalMinutes: persona.sessions.reduce((sum, s) => sum + s.duration, 0),
    currentStreak: calculateStreak(persona.sessions),
    longestStreak: calculateStreak(persona.sessions),
    achievementsUnlocked: [
      'first_steps',
      'getting_started',
      'dedicated_mind',
      'building_habits',
      'ai_awakening',
      'ai_believer',
      'self_aware',
      'mood_tracker',
    ],
    aiRecommendationsUsed: Math.floor(persona.sessions.length * 0.6),
    moodEntriesLogged: persona.sessions.length,
    averageMoodScore: persona.sessions.reduce((sum, s) => sum + s.mood, 0) / persona.sessions.length,
    favoriteGoal: persona.goal,
    joinDate: persona.sessions[0].timestamp.toISOString(),
    lastActiveDate: new Date().toISOString(),
  };

  // Save to localStorage
  localStorage.setItem('harmony_training_data', JSON.stringify(trainingData));
  localStorage.setItem('harmony_user_stats', JSON.stringify(stats));
  localStorage.setItem('harmony_demo_mode', 'true');
  localStorage.setItem('harmony_demo_persona', persona.name);

  console.log(`✅ Demo data loaded for persona: ${persona.name}`);
  console.log(`📊 Sessions: ${persona.sessions.length}, Streak: ${stats.currentStreak} days`);
}

/**
 * Calculate current streak from sessions
 */
function calculateStreak(sessions: Array<{ timestamp: Date }>): number {
  if (sessions.length === 0) return 0;

  const sortedDates = sessions
    .map(s => new Date(s.timestamp).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Must have session today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);
    const diffDays = Math.round((current.getTime() - next.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('harmony_demo_mode') === 'true';
}

/**
 * Get demo persona name
 */
export function getDemoPersonaName(): string {
  if (typeof window === 'undefined') return 'Demo User';
  return localStorage.getItem('harmony_demo_persona') || 'Demo User';
}

/**
 * Clear demo data and reset to fresh state
 */
export function clearDemoData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('harmony_training_data');
  localStorage.removeItem('harmony_user_stats');
  localStorage.removeItem('harmony_demo_mode');
  localStorage.removeItem('harmony_demo_persona');
  console.log('🧹 Demo data cleared');
}
