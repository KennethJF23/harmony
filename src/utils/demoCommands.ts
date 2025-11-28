/**
 * Demo Mode Setup Script
 * Run this in browser console to activate/reset demo mode
 * 
 * Usage in console:
 *   activateDemo(0)  // Load Alex Chen persona
 *   activateDemo(1)  // Load Maya Patel persona  
 *   activateDemo(2)  // Load Jordan Night persona
 *   resetDemo()      // Clear all data and start fresh
 */

// This file is for documentation only - the actual functions are in demoData.ts
// To use in browser console:

/*
// Activate demo with persona
window.activateDemoMode = (personaIndex = 0) => {
  const { loadDemoData } = require('@/utils/demoData');
  loadDemoData(personaIndex);
  console.log('✅ Demo mode activated! Refreshing page...');
  setTimeout(() => window.location.reload(), 500);
};

// Reset to fresh state
window.resetDemoMode = () => {
  const { clearDemoData } = require('@/utils/demoData');
  clearDemoData();
  console.log('🧹 Demo mode cleared! Refreshing page...');
  setTimeout(() => window.location.reload(), 500);
};

// View current stats
window.viewDemoStats = () => {
  const stats = JSON.parse(localStorage.getItem('harmony_user_stats') || '{}');
  const training = JSON.parse(localStorage.getItem('harmony_training_data') || '[]');
  console.log('📊 Demo Statistics:');
  console.table({
    'Total Sessions': stats.totalSessions,
    'Current Streak': stats.currentStreak + ' days',
    'Average Mood': stats.averageMoodScore?.toFixed(1),
    'Achievements': stats.achievementsUnlocked?.length,
    'Training Data Points': training.length,
    'Persona Name': localStorage.getItem('harmony_demo_persona'),
  });
  return { stats, training };
};
*/

// Quick reference commands for hackathon demo:

export const DEMO_COMMANDS = {
  activate: `
// Load demo persona (0=Alex, 1=Maya, 2=Jordan)
import { loadDemoData } from '@/utils/demoData';
loadDemoData(0);
location.reload();
  `,
  
  reset: `
// Clear all demo data
import { clearDemoData } from '@/utils/demoData';
clearDemoData();
location.reload();
  `,
  
  stats: `
// View current statistics
JSON.parse(localStorage.getItem('harmony_user_stats'));
  `,
  
  training: `
// View ML training data
JSON.parse(localStorage.getItem('harmony_training_data'));
  `,
  
  checkMode: `
// Check if demo mode is active
import { isDemoMode, getDemoPersonaName } from '@/utils/demoData';
console.log('Demo Mode:', isDemoMode());
console.log('Persona:', getDemoPersonaName());
  `,
};

// Export for reference
export default DEMO_COMMANDS;
