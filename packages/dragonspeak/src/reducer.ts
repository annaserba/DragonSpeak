import type { GameEvent } from "./events";
import type { GameState, UnlockedWord } from "./state";
import { initialGameState } from "./state";

const MAX_EVENT_LOG = 200;

const appendEvent = (state: GameState, event: GameEvent) => ({
  ...state,
  eventLog: [...state.eventLog, event].slice(-MAX_EVENT_LOG),
});

const upsertWord = (
  words: UnlockedWord[],
  event: Extract<GameEvent, { type: "WORD_UNLOCKED" }>,
) => {
  if (words.some((word) => word.wordId === event.wordId)) {
    return words;
  }

  return [
    ...words,
    {
      wordId: event.wordId,
      hanzi: event.hanzi,
      pinyin: event.pinyin,
      meaning: event.meaning,
      status: "new" as const,
      unlockedAt: event.timestamp,
    },
  ];
};

export function gameReducer(state: GameState = initialGameState, event: GameEvent): GameState {
  const next = appendEvent(state, event);

  switch (event.type) {
    case "QUEST_STARTED":
      return {
        ...next,
        questId: event.questId,
        status: "active",
        progress: 8,
        reward: null,
      };
    case "NPC_MESSAGE": {
      const line = {
        npcId: event.npcId,
        text: event.text,
        pinyin: event.pinyin,
        translation: event.translation,
        timestamp: event.timestamp,
      };

      return {
        ...next,
        currentDialogue: line,
        dialogueHistory: [...next.dialogueHistory, line],
        status: "active",
      };
    }
    case "CHOICES_SHOWN":
      return {
        ...next,
        activeQuestionId: event.questionId,
        choices: event.choices,
        status: "answering",
        progress: Math.max(next.progress, 38),
      };
    case "PLAYER_ANSWERED":
      return {
        ...next,
        answers: [
          ...next.answers,
          {
            playerId: event.playerId,
            answerId: event.answerId,
            correct: event.correct,
            timestamp: event.timestamp,
            questionId: next.activeQuestionId,
          },
        ],
      };
    case "SCORE_UPDATED":
      return {
        ...next,
        score: event.playerId === "player-you" ? event.score : next.score,
        progress: Math.max(next.progress, event.score >= 120 ? 74 : 56),
      };
    case "WORD_UNLOCKED":
      return {
        ...next,
        unlockedWords: upsertWord(next.unlockedWords, event),
      };
    case "LEADERBOARD_UPDATED":
      return {
        ...next,
        leaderboard: event.players,
      };
    case "QUEST_COMPLETED":
      return {
        ...next,
        status: "completed",
        progress: 100,
        choices: [],
        activeQuestionId: null,
        reward: event.reward,
      };
    default:
      return next;
  }
}
