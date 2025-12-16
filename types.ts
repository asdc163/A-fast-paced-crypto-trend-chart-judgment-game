
export interface Candle {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface LevelData {
  id: string; // Added ID for deduplication
  candles: Candle[];
  outcome: 'LONG' | 'SHORT';
  patternName: string;
  explanation: string;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  REVEAL = 'REVEAL',
  GAME_OVER = 'GAME_OVER',
}

export enum Prediction {
  LONG = 'LONG',
  SHORT = 'SHORT',
  NONE = 'NONE',
}

export interface PlayerStats {
  score: number;       // Current score out of 10
  totalLevels: number; // Should be 10
  history: boolean[];  // Win/Loss history
  godsEyeUsed: number;
  averageDecisionTimeMs: number;
}

export interface AiAnalysis {
  title: string;
  description: string;
  powerLevel: number; // 1-100
  archetype: string; // e.g. "Degen", "Whale", "Paper Hands"
}
