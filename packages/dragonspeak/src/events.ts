export type Language = "en" | "ru";

export type Choice = {
  id: string;
  text: string;
  pinyin: string;
  translation: string;
};

export type PlayerScore = {
  playerId: string;
  displayName: string;
  score: number;
  streak: number;
  isCurrentPlayer?: boolean;
};

export type Reward = {
  xp: number;
  title: string;
  unlockedBadge: string;
};

export type GameEvent =
  | { type: "QUEST_STARTED"; questId: string; timestamp: number }
  | {
      type: "NPC_MESSAGE";
      npcId: string;
      text: string;
      pinyin: string;
      translation: string;
      timestamp: number;
    }
  | {
      type: "CHOICES_SHOWN";
      questionId: string;
      choices: Choice[];
      timestamp: number;
    }
  | {
      type: "PLAYER_ANSWERED";
      playerId: string;
      answerId: string;
      correct: boolean;
      timestamp: number;
    }
  | {
      type: "SCORE_UPDATED";
      playerId: string;
      score: number;
      timestamp: number;
    }
  | {
      type: "WORD_UNLOCKED";
      wordId: string;
      hanzi: string;
      pinyin: string;
      meaning: string;
      timestamp: number;
    }
  | {
      type: "LEADERBOARD_UPDATED";
      players: PlayerScore[];
      timestamp: number;
    }
  | {
      type: "QUEST_COMPLETED";
      questId: string;
      reward: Reward;
      timestamp: number;
    };

export type GameEventType = GameEvent["type"];

export const createTimestamp = () => Date.now();
