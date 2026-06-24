import { UserStats, PracticeRecord, LearnedPhrase } from '../types';

const STORAGE_KEY = 'echoscene_user_stats_v1';

const defaultStats: UserStats = {
  completedScenes: [],
  streakDays: 0,
  lastPracticeDate: '',
  totalRounds: 0,
  savedPhrases: [],
  history: [],
};

export function getUserStats(): UserStats {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultStats;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read stats from localStorage', e);
    return defaultStats;
  }
}

export function savePracticeRecord(record: PracticeRecord): UserStats {
  const stats = getUserStats();
  
  // Calculate today YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Update streak
  if (stats.lastPracticeDate !== today) {
    const lastDate = stats.lastPracticeDate ? new Date(stats.lastPracticeDate) : null;
    const currentDate = new Date(today);
    
    if (lastDate) {
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        stats.streakDays += 1;
      } else if (diffDays > 1) {
        stats.streakDays = 1;
      }
    } else {
      stats.streakDays = 1;
    }
    stats.lastPracticeDate = today;
  }

  // Update completed scenes
  if (!stats.completedScenes.includes(record.sceneId)) {
    stats.completedScenes.push(record.sceneId);
  }

  stats.totalRounds += record.rounds;
  
  // Add to history (keep newest 20)
  stats.history = [record, ...stats.history].slice(0, 20);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }

  return stats;
}

export function toggleSavePhrase(phrase: LearnedPhrase): { saved: boolean; stats: UserStats } {
  const stats = getUserStats();
  const existsIndex = stats.savedPhrases.findIndex(p => p.phrase.toLowerCase() === phrase.phrase.toLowerCase());
  
  let saved = false;
  if (existsIndex >= 0) {
    stats.savedPhrases.splice(existsIndex, 1);
    saved = false;
  } else {
    stats.savedPhrases.push(phrase);
    saved = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save phrase', e);
  }

  return { saved, stats };
}
