import { describe, expect, it } from "vitest";
import type { GameEvent } from "./events";
import { gameReducer } from "./reducer";
import { initialGameState } from "./state";

const timestamp = 1_700_000_000_000;

describe("gameReducer", () => {
  it("starts a quest from a typed event", () => {
    const event: GameEvent = {
      type: "QUEST_STARTED",
      questId: "restaurant-shanghai",
      timestamp,
    };

    const state = gameReducer(initialGameState, event);

    expect(state.questId).toBe("restaurant-shanghai");
    expect(state.status).toBe("active");
    expect(state.eventLog).toHaveLength(1);
  });

  it("updates the current player's score only from SCORE_UPDATED", () => {
    const state = gameReducer(initialGameState, {
      type: "SCORE_UPDATED",
      playerId: "player-you",
      score: 120,
      timestamp,
    });

    const afterOtherPlayer = gameReducer(state, {
      type: "SCORE_UPDATED",
      playerId: "lin",
      score: 999,
      timestamp: timestamp + 1,
    });

    expect(state.score).toBe(120);
    expect(afterOtherPlayer.score).toBe(120);
  });

  it("unlocks words once and keeps vocabulary stable", () => {
    const event: GameEvent = {
      type: "WORD_UNLOCKED",
      wordId: "cha",
      hanzi: "茶",
      pinyin: "cha",
      meaning: "tea",
      timestamp,
    };

    const state = gameReducer(gameReducer(initialGameState, event), event);

    expect(state.unlockedWords).toHaveLength(1);
    expect(state.unlockedWords[0]).toMatchObject({ hanzi: "茶", status: "new" });
  });

  it("handles dialogue, choices, answers, and completion events", () => {
    const events: GameEvent[] = [
      {
        type: "NPC_MESSAGE",
        npcId: "seller-mei",
        text: "欢迎光临！",
        pinyin: "Huanying guanglin!",
        translation: "Welcome!",
        timestamp,
      },
      {
        type: "CHOICES_SHOWN",
        questionId: "q1",
        choices: [{ id: "a1", text: "茶", pinyin: "cha", translation: "tea" }],
        timestamp: timestamp + 1,
      },
      {
        type: "PLAYER_ANSWERED",
        playerId: "player-you",
        answerId: "a1",
        correct: true,
        timestamp: timestamp + 2,
      },
      {
        type: "QUEST_COMPLETED",
        questId: "restaurant-shanghai",
        reward: { xp: 120, title: "Starter", unlockedBadge: "Tea" },
        timestamp: timestamp + 3,
      },
    ];

    const state = events.reduce(gameReducer, initialGameState);

    expect(state.currentDialogue?.text).toBe("欢迎光临！");
    expect(state.choices).toEqual([]);
    expect(state.answers[0].correct).toBe(true);
    expect(state.status).toBe("completed");
    expect(state.progress).toBe(100);
  });
});
