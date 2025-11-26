/**
 * Lightweight client-side ML engine using k-Nearest Neighbors (kNN)
 * Predicts optimal track recommendations based on user behavior
 */

import { TrainingDataPoint, getTrainingData } from './storage';

export interface PredictionInput {
  goal: 'focus' | 'sleep' | 'relaxation' | 'creativity';
  timeOfDay?: number; // hour 0-23
  currentMood?: number; // 1-5
  recentProductivity?: number; // 1-5
}

export interface PredictionResult {
  recommendedTrackId: number;
  confidence: number;
  reason: string;
  frequency: string;
}

export class MLEngine {
  private trainingData: TrainingDataPoint[] = [];
  private k: number = 5; // number of neighbors to consider

  constructor() {
    this.loadTrainingData();
  }

  /**
   * Load training data from storage
   */
  private loadTrainingData(): void {
    this.trainingData = getTrainingData();
  }

  /**
   * Refresh training data
   */
  public refresh(): void {
    this.loadTrainingData();
  }

  /**
   * Calculate Euclidean distance between two feature vectors
   */
  private calculateDistance(pointA: number[], pointB: number[]): number {
    if (pointA.length !== pointB.length) {
      throw new Error('Feature vectors must have same length');
    }

    let sum = 0;
    for (let i = 0; i < pointA.length; i++) {
      sum += Math.pow(pointA[i] - pointB[i], 2);
    }

    return Math.sqrt(sum);
  }

  /**
   * Normalize a value between 0 and 1
   */
  private normalize(value: number, min: number, max: number): number {
    if (max === min) return 0.5;
    return (value - min) / (max - min);
  }

  /**
   * Convert input to feature vector
   */
  private inputToFeatures(input: PredictionInput): number[] {
    const now = new Date();
    const timeOfDay = input.timeOfDay ?? now.getHours();
    const dayOfWeek = now.getDay();
    
    // Map goal to numeric value
    const goalMap = { focus: 0, relaxation: 0.33, creativity: 0.66, sleep: 1 };
    const goalValue = goalMap[input.goal];

    // Feature vector: [goal, timeOfDay, dayOfWeek, currentMood, recentProductivity]
    return [
      goalValue,
      this.normalize(timeOfDay, 0, 23),
      this.normalize(dayOfWeek, 0, 6),
      input.currentMood ? this.normalize(input.currentMood, 1, 5) : 0.5,
      input.recentProductivity ? this.normalize(input.recentProductivity, 1, 5) : 0.5,
    ];
  }

  /**
   * Find k nearest neighbors
   */
  private findKNearestNeighbors(features: number[], k: number): TrainingDataPoint[] {
    if (this.trainingData.length === 0) {
      return [];
    }

    // Calculate distances
    const distances = this.trainingData.map((point) => ({
      point,
      distance: this.calculateDistance(features, point.features),
    }));

    // Sort by distance and take k nearest
    distances.sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, Math.min(k, distances.length)).map((d) => d.point);
  }

  /**
   * Predict optimal track based on input features
   */
  public predict(input: PredictionInput): PredictionResult {
    // If no training data, return default based on goal
    if (this.trainingData.length < 3) {
      return this.getDefaultRecommendation(input.goal);
    }

    // Convert input to features
    const inputFeatures = this.inputToFeatures(input);

    // Find k nearest neighbors
    const neighbors = this.findKNearestNeighbors(inputFeatures, this.k);

    if (neighbors.length === 0) {
      return this.getDefaultRecommendation(input.goal);
    }

    // Weight neighbors by effectiveness and recency
    const now = Date.now();
    const weightedVotes: Record<number, { score: number; frequency: string; count: number }> = {};

    neighbors.forEach((neighbor) => {
      const recencyWeight = 1 / (1 + (now - neighbor.timestamp) / (7 * 24 * 60 * 60 * 1000)); // Decay over weeks
      const effectivenessWeight = neighbor.effectiveness / 5; // Normalize to 0-1
      const weight = recencyWeight * effectivenessWeight;

      if (!weightedVotes[neighbor.trackId]) {
        weightedVotes[neighbor.trackId] = {
          score: 0,
          frequency: neighbor.trackFrequency,
          count: 0,
        };
      }

      weightedVotes[neighbor.trackId].score += weight;
      weightedVotes[neighbor.trackId].count += 1;
    });

    // Find track with highest weighted score
    let bestTrackId = -1;
    let bestScore = -1;
    let bestFrequency = '';
    let totalCount = 0;

    Object.entries(weightedVotes).forEach(([trackId, data]) => {
      if (data.score > bestScore) {
        bestScore = data.score;
        bestTrackId = parseInt(trackId);
        bestFrequency = data.frequency;
      }
      totalCount += data.count;
    });

    // Calculate confidence based on consistency of neighbors
    const topTrackCount = weightedVotes[bestTrackId]?.count || 0;
    const confidence = Math.min(0.95, (topTrackCount / totalCount) * 0.7 + 0.3); // 30-95% range

    return {
      recommendedTrackId: bestTrackId,
      confidence,
      frequency: bestFrequency,
      reason: this.generateReason(input, neighbors, confidence),
    };
  }

  /**
   * Get default recommendation when no training data exists
   */
  private getDefaultRecommendation(goal: string): PredictionResult {
    const defaults: Record<string, { trackId: number; frequency: string; reason: string }> = {
      focus: {
        trackId: 1,
        frequency: '8-12 Hz',
        reason: 'Alpha waves are scientifically proven to enhance concentration and mental clarity.',
      },
      relaxation: {
        trackId: 2,
        frequency: '4-8 Hz',
        reason: 'Theta waves promote deep relaxation and stress relief.',
      },
      creativity: {
        trackId: 3,
        frequency: '13-30 Hz',
        reason: 'Beta waves stimulate creative thinking and problem-solving.',
      },
      sleep: {
        trackId: 4,
        frequency: '0.5-4 Hz',
        reason: 'Delta waves induce deep, restorative sleep.',
      },
    };

    const rec = defaults[goal] || defaults.focus;

    return {
      recommendedTrackId: rec.trackId,
      confidence: 0.6,
      frequency: rec.frequency,
      reason: rec.reason,
    };
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private generateReason(
    input: PredictionInput,
    neighbors: TrainingDataPoint[],
    confidence: number
  ): string {
    if (neighbors.length === 0) {
      return 'Based on scientific research for your goal.';
    }

    const avgEffectiveness =
      neighbors.reduce((sum, n) => sum + n.effectiveness, 0) / neighbors.length;
    
    const avgMoodImprovement =
      neighbors
        .filter((n) => n.moodBefore !== undefined)
        .reduce((sum, n) => sum + (n.moodAfter - (n.moodBefore || 3)), 0) /
      Math.max(1, neighbors.filter((n) => n.moodBefore !== undefined).length);

    if (confidence > 0.8 && avgEffectiveness >= 4) {
      return `This frequency has been highly effective for you in similar sessions (${(avgEffectiveness * 20).toFixed(0)}% effectiveness).`;
    }

    if (avgMoodImprovement > 0.5) {
      return `Based on your history, this track typically improves your mood and ${input.goal} state.`;
    }

    return `Recommended based on ${neighbors.length} similar sessions with ${(confidence * 100).toFixed(0)}% confidence.`;
  }

  /**
   * Get model statistics
   */
  public getModelStats(): {
    trainingDataCount: number;
    averageEffectiveness: number;
    goalDistribution: Record<string, number>;
    ready: boolean;
  } {
    const goalDist: Record<string, number> = {
      focus: 0,
      sleep: 0,
      relaxation: 0,
      creativity: 0,
    };

    let totalEffectiveness = 0;

    this.trainingData.forEach((point) => {
      goalDist[point.goal] = (goalDist[point.goal] || 0) + 1;
      totalEffectiveness += point.effectiveness;
    });

    return {
      trainingDataCount: this.trainingData.length,
      averageEffectiveness:
        this.trainingData.length > 0 ? totalEffectiveness / this.trainingData.length : 0,
      goalDistribution: goalDist,
      ready: this.trainingData.length >= 5,
    };
  }
}

// Singleton instance
let mlEngineInstance: MLEngine | null = null;

/**
 * Get ML Engine singleton instance
 */
export const getMLEngine = (): MLEngine => {
  if (!mlEngineInstance) {
    mlEngineInstance = new MLEngine();
  }
  return mlEngineInstance;
};

/**
 * UI-friendly prediction wrapper with formatted output
 */
export interface UIRecommendation {
  trackId: number;
  trackName: string;
  duration: string;
  frequency: string;
  confidence: number; // 0-100
  reason: string;
  isReady: boolean;
}

export const predictForUI = (context?: {
  goal?: 'focus' | 'sleep' | 'relaxation' | 'creativity';
  timeOfDay?: number;
  currentMood?: number;
  recentProductivity?: number;
}): UIRecommendation => {
  const mlEngine = getMLEngine();
  const stats = mlEngine.getModelStats();

  // Provide warning context if insufficient training data
  if (stats.trainingDataCount < 3) {
    return {
      trackId: 1,
      trackName: 'Deep Focus Alpha',
      duration: '25:00',
      frequency: '40 Hz',
      confidence: 0,
      reason: 'Building your preference profile... Complete 3+ sessions for personalized recommendations.',
      isReady: false,
    };
  }

  // Default context if not provided
  const defaultContext: PredictionInput = {
    goal: context?.goal || 'focus',
    timeOfDay: context?.timeOfDay,
    currentMood: context?.currentMood,
    recentProductivity: context?.recentProductivity,
  };

  // Get prediction
  const prediction = mlEngine.predict(defaultContext);

  // Map track IDs to names and durations
  const trackMap: Record<number, { name: string; duration: string }> = {
    1: { name: 'Deep Focus Alpha', duration: '25:00' },
    2: { name: 'Theta Meditation', duration: '30:00' },
    3: { name: 'Creative Flow Beta', duration: '45:00' },
    4: { name: 'Delta Sleep Wave', duration: '60:00' },
  };

  const trackInfo = trackMap[prediction.recommendedTrackId] || {
    name: 'Deep Focus Alpha',
    duration: '25:00',
  };

  return {
    trackId: prediction.recommendedTrackId,
    trackName: trackInfo.name,
    duration: trackInfo.duration,
    frequency: prediction.frequency,
    confidence: Math.round(prediction.confidence * 100),
    reason: prediction.reason,
    isReady: stats.ready,
  };
};
