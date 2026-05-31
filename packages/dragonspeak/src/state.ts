import type { Choice, GameEvent, PlayerScore, Reward } from "./events";

export type QuestStatus = "idle" | "connecting" | "active" | "answering" | "completed";

export type DialogueLine = {
  npcId: string;
  text: string;
  pinyin: string;
  translation: string;
  timestamp: number;
};

export type UnlockedWord = {
  wordId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  status: "new" | "reviewing" | "mastered";
  unlockedAt: number;
};

export type AnswerRecord = {
  playerId: string;
  answerId: string;
  correct: boolean;
  timestamp: number;
  questionId: string | null;
};

export type GameState = {
  questId: string | null;
  status: QuestStatus;
  activeQuestionId: string | null;
  currentDialogue: DialogueLine | null;
  dialogueHistory: DialogueLine[];
  choices: Choice[];
  score: number;
  progress: number;
  unlockedWords: UnlockedWord[];
  leaderboard: PlayerScore[];
  answers: AnswerRecord[];
  eventLog: GameEvent[];
  reward: Reward | null;
};

export const initialGameState: GameState = {
  questId: null,
  status: "idle",
  activeQuestionId: null,
  currentDialogue: null,
  dialogueHistory: [],
  choices: [],
  score: 0,
  progress: 0,
  unlockedWords: [],
  leaderboard: [],
  answers: [],
  eventLog: [],
  reward: null,
};
