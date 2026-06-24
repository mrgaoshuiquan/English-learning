export type SceneCategory = 'Daily Life' | 'Travel' | 'Workplace' | 'Social';
export type SceneDifficulty = 'Beginner' | 'Intermediate';

export interface DialogueTurn {
  role: 'ai' | 'user';
  text: string;
  translation?: string;
}

export interface Vocabulary {
  word: string;
  meaning: string;
  example?: string;
}

export interface Scene {
  id: string;
  title: string;
  titleZh: string;
  category: SceneCategory;
  difficulty: SceneDifficulty;
  duration: string;
  emoji: string;
  description: string;
  aiRole: string;
  aiRoleZh: string;
  aiFirstMessage: string;
  sampleDialogue: DialogueTurn[];
  vocabulary: Vocabulary[];
  hints: string[];
}

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface ImprovementSuggestion {
  original: string;
  better: string;
  explanation: string;
}

export interface LearnedPhrase {
  phrase: string;
  meaning: string;
  example: string;
}

export interface FeedbackReport {
  scores: {
    fluency: number;
    accuracy: number;
    naturalness: number;
  };
  highlights: string[];
  improvements: ImprovementSuggestion[];
  phrases: LearnedPhrase[];
  createdAt?: string;
}

export interface PracticeRecord {
  id: string;
  sceneId: string;
  sceneTitle: string;
  completedAt: string;
  rounds: number;
  report: FeedbackReport;
}

export interface UserStats {
  completedScenes: string[]; // list of sceneIds
  streakDays: number;
  lastPracticeDate: string; // YYYY-MM-DD
  totalRounds: number;
  savedPhrases: LearnedPhrase[];
  history: PracticeRecord[];
}
