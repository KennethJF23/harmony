import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface RecommendationRequest {
  mood?: string;
  lastSessions?: Array<{
    trackId: string;
    duration: number;
    timestamp: number;
  }>;
  studyGoal?: string;
}

interface RecommendationResponse {
  trackId: string;
  duration: number;
  tips: string[];
  reasoning: string;
}

// Fallback recommendations when no AI available
const FALLBACK_RECOMMENDATIONS: Record<string, RecommendationResponse> = {
  focus: {
    trackId: 'focus-1',
    duration: 25,
    tips: [
      'Start with a 5-minute warm-up to settle into focus mode',
      'Keep your phone in another room',
      'Take notes by hand for better retention'
    ],
    reasoning: 'Beta waves (14-30 Hz) enhance concentration and alertness'
  },
  stressed: {
    trackId: 'relaxation-1',
    duration: 15,
    tips: [
      'Try box breathing: 4 seconds in, 4 hold, 4 out, 4 hold',
      'Dim the lights and close unnecessary tabs',
      'Stay hydrated - keep water nearby'
    ],
    reasoning: 'Alpha waves (8-13 Hz) promote relaxation while maintaining awareness'
  },
  tired: {
    trackId: 'focus-2',
    duration: 20,
    tips: [
      'Stand up and stretch for 2 minutes before starting',
      'Use the Pomodoro technique: 25 min work, 5 min break',
      'Natural light helps - open curtains or sit near a window'
    ],
    reasoning: 'Mid-range beta waves help boost alertness without causing anxiety'
  },
  creative: {
    trackId: 'creativity-1',
    duration: 30,
    tips: [
      'Let your mind wander during breaks',
      'Keep a notepad nearby for spontaneous ideas',
      'Try mind mapping instead of linear notes'
    ],
    reasoning: 'Theta waves (4-7 Hz) facilitate creative thinking and insight'
  },
  default: {
    trackId: 'focus-1',
    duration: 25,
    tips: [
      'Create a dedicated study space',
      'Use the 2-minute rule: if it takes less than 2 min, do it now',
      'Break large tasks into smaller, manageable chunks'
    ],
    reasoning: 'Balanced frequency mix helps maintain sustained focus'
  }
};

async function getAIRecommendation(request: RecommendationRequest): Promise<RecommendationResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // Return fallback
    const mood = request.mood?.toLowerCase() || 'default';
    return FALLBACK_RECOMMENDATIONS[mood] || FALLBACK_RECOMMENDATIONS.default;
  }

  try {
    const prompt = `You are a neuroscience-based study coach for students. Analyze the following and provide a personalized recommendation:

Current mood: ${request.mood || 'focused'}
Study goal: ${request.studyGoal || 'general study session'}
Recent sessions: ${request.lastSessions?.length || 0} completed

Available tracks:
- focus-1: Beta waves (14-30 Hz) - Deep concentration
- focus-2: Mid-beta waves (16-20 Hz) - Sustained attention
- relaxation-1: Alpha waves (8-13 Hz) - Calm alertness
- creativity-1: Theta waves (4-7 Hz) - Creative insight
- sleep-1: Delta waves (0.5-3 Hz) - Deep relaxation

Respond in JSON format:
{
  "trackId": "focus-1",
  "duration": 25,
  "tips": ["tip1", "tip2", "tip3"],
  "reasoning": "brief explanation"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a neuroscience-based study coach. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback on error
    const mood = request.mood?.toLowerCase() || 'default';
    return FALLBACK_RECOMMENDATIONS[mood] || FALLBACK_RECOMMENDATIONS.default;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    
    const recommendation = await getAIRecommendation(body);
    
    return NextResponse.json({
      success: true,
      recommendation,
      usingAI: !!process.env.OPENAI_API_KEY
    });
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate recommendation',
        recommendation: FALLBACK_RECOMMENDATIONS.default,
        usingAI: false
      },
      { status: 500 }
    );
  }
}
