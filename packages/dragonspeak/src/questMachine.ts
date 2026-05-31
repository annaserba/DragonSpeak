import type { Choice, GameEvent, PlayerScore } from "./events";
import { createTimestamp } from "./events";

export const QUEST_ID = "restaurant-shanghai";
export const PLAYER_ID = "player-you";

export const restaurantChoices: Choice[] = [
  {
    id: "answer-tea",
    text: "我要一杯茶。",
    pinyin: "Wo yao yi bei cha.",
    translation: "I would like a cup of tea.",
  },
  {
    id: "answer-station",
    text: "地铁站在哪里？",
    pinyin: "Ditie zhan zai nali?",
    translation: "Where is the metro station?",
  },
  {
    id: "answer-price",
    text: "你叫什么名字？",
    pinyin: "Ni jiao shenme mingzi?",
    translation: "What is your name?",
  },
];

const foodChoices: Choice[] = [
  {
    id: "answer-dumplings",
    text: "我要饺子。",
    pinyin: "Wo yao jiaozi.",
    translation: "I want dumplings.",
  },
  {
    id: "answer-noodles",
    text: "我要面条。",
    pinyin: "Wo yao miantiao.",
    translation: "I want noodles.",
  },
  {
    id: "answer-price-food",
    text: "这个多少钱？",
    pinyin: "Zhege duoshao qian?",
    translation: "How much is this?",
  },
];

const billChoices: Choice[] = [
  {
    id: "answer-bill",
    text: "请给我账单。",
    pinyin: "Qing gei wo zhangdan.",
    translation: "Please give me the bill.",
  },
  {
    id: "answer-more-tea",
    text: "我再要一杯茶。",
    pinyin: "Wo zai yao yi bei cha.",
    translation: "I want another cup of tea.",
  },
  {
    id: "answer-bathroom",
    text: "洗手间在哪里？",
    pinyin: "Xishoujian zai nali?",
    translation: "Where is the bathroom?",
  },
];

export const initialLeaderboard: PlayerScore[] = [
  { playerId: PLAYER_ID, displayName: "You", score: 0, streak: 0, isCurrentPlayer: true },
  { playerId: "lin", displayName: "Lin", score: 80, streak: 2 },
  { playerId: "masha", displayName: "Masha", score: 60, streak: 1 },
  { playerId: "alex", displayName: "Alex", score: 40, streak: 1 },
];

type QuestStep = "drink" | "food" | "bill";
let currentStep: QuestStep = "drink";

export const createQuestStartEvents = (): GameEvent[] => {
  currentStep = "drink";

  return [
    { type: "QUEST_STARTED", questId: QUEST_ID, timestamp: createTimestamp() },
    {
      type: "NPC_MESSAGE",
      npcId: "seller-mei",
      text: "欢迎光临！你想喝点什么？",
      pinyin: "Huanying guanglin! Ni xiang he dian shenme?",
      translation: "Welcome! What would you like to drink?",
      timestamp: createTimestamp() + 120,
    },
    {
      type: "CHOICES_SHOWN",
      questionId: "q-order-drink",
      choices: restaurantChoices,
      timestamp: createTimestamp() + 240,
    },
    {
      type: "LEADERBOARD_UPDATED",
      players: initialLeaderboard,
      timestamp: createTimestamp() + 260,
    },
  ];
};

function createDrinkAnswerEvents(answerId: string): GameEvent[] {
  const correct = answerId === "answer-tea";
  const score = correct ? 120 : 20;
  const now = createTimestamp();

  const players: PlayerScore[] = [
    {
      playerId: PLAYER_ID,
      displayName: "You",
      score,
      streak: correct ? 1 : 0,
      isCurrentPlayer: true,
    },
    { playerId: "lin", displayName: "Lin", score: 140, streak: 3 },
    { playerId: "masha", displayName: "Masha", score: 100, streak: 2 },
    { playerId: "alex", displayName: "Alex", score: 70, streak: 1 },
  ].sort((a, b) => b.score - a.score);

  return [
    {
      type: "PLAYER_ANSWERED",
      playerId: PLAYER_ID,
      answerId,
      correct,
      timestamp: now,
    },
    {
      type: "SCORE_UPDATED",
      playerId: PLAYER_ID,
      score,
      timestamp: now + 80,
    },
    {
      type: "NPC_MESSAGE",
      npcId: "seller-mei",
      text: correct ? "很好！请稍等。" : "差一点。点茶可以说：我要一杯茶。",
      pinyin: correct
        ? "Hen hao! Qing shao deng."
        : "Cha yi dian. Dian cha keyi shuo: Wo yao yi bei cha.",
      translation: correct
        ? "Very good! Please wait a moment."
        : "Almost. To order tea, you can say: I would like a cup of tea.",
      timestamp: now + 180,
    },
    {
      type: "WORD_UNLOCKED",
      wordId: "cha",
      hanzi: "茶",
      pinyin: "cha",
      meaning: "tea / чай",
      timestamp: now + 260,
    },
    {
      type: "WORD_UNLOCKED",
      wordId: "qing",
      hanzi: "请",
      pinyin: "qing",
      meaning: "please / пожалуйста",
      timestamp: now + 320,
    },
    {
      type: "LEADERBOARD_UPDATED",
      players,
      timestamp: now + 360,
    },
    {
      type: "NPC_MESSAGE",
      npcId: "seller-mei",
      text: "你想吃点什么？",
      pinyin: "Ni xiang chi dian shenme?",
      translation: "What would you like to eat?",
      timestamp: now + 500,
    },
    {
      type: "CHOICES_SHOWN",
      questionId: "q-order-food",
      choices: foodChoices,
      timestamp: now + 600,
    },
  ];
}

function createFoodAnswerEvents(answerId: string): GameEvent[] {
  const correct = answerId === "answer-dumplings";
  const cumulativeScore = correct ? 240 : 40;
  const now = createTimestamp();

  const players: PlayerScore[] = [
    {
      playerId: PLAYER_ID,
      displayName: "You",
      score: cumulativeScore,
      streak: correct ? 2 : 0,
      isCurrentPlayer: true,
    },
    { playerId: "lin", displayName: "Lin", score: 200, streak: 3 },
    { playerId: "masha", displayName: "Masha", score: 160, streak: 2 },
    { playerId: "alex", displayName: "Alex", score: 100, streak: 2 },
  ].sort((a, b) => b.score - a.score);

  return [
    {
      type: "PLAYER_ANSWERED",
      playerId: PLAYER_ID,
      answerId,
      correct,
      timestamp: now,
    },
    {
      type: "SCORE_UPDATED",
      playerId: PLAYER_ID,
      score: cumulativeScore,
      timestamp: now + 80,
    },
    {
      type: "NPC_MESSAGE",
      npcId: "seller-mei",
      text: correct ? "好的，马上来！" : "不好意思，我们这里没有。你试试饺子吧！",
      pinyin: correct
        ? "Hao de, mashang lai!"
        : "Bu haoyisi, women zheli meiyou. Ni shishi jiaozi ba!",
      translation: correct
        ? "Okay, coming right up!"
        : "Sorry, we don't have that. Try the dumplings!",
      timestamp: now + 180,
    },
    {
      type: "WORD_UNLOCKED",
      wordId: "jiaozi",
      hanzi: "饺子",
      pinyin: "jiaozi",
      meaning: "dumplings / пельмени",
      timestamp: now + 260,
    },
    {
      type: "WORD_UNLOCKED",
      wordId: "hao",
      hanzi: "好",
      pinyin: "hao",
      meaning: "good / хорошо",
      timestamp: now + 320,
    },
    {
      type: "LEADERBOARD_UPDATED",
      players,
      timestamp: now + 360,
    },
    {
      type: "NPC_MESSAGE",
      npcId: "seller-mei",
      text: "还需要什么吗？",
      pinyin: "Hai xuyao shenme ma?",
      translation: "Do you need anything else?",
      timestamp: now + 500,
    },
    {
      type: "CHOICES_SHOWN",
      questionId: "q-pay-bill",
      choices: billChoices,
      timestamp: now + 600,
    },
  ];
}

function createBillAnswerEvents(answerId: string): GameEvent[] {
  const correct = answerId === "answer-bill";
  const cumulativeScore = correct ? 360 : 60;
  const now = createTimestamp();

  const players: PlayerScore[] = [
    {
      playerId: PLAYER_ID,
      displayName: "You",
      score: cumulativeScore,
      streak: correct ? 3 : 0,
      isCurrentPlayer: true,
    },
    { playerId: "lin", displayName: "Lin", score: 260, streak: 4 },
    { playerId: "masha", displayName: "Masha", score: 220, streak: 2 },
    { playerId: "alex", displayName: "Alex", score: 140, streak: 2 },
  ].sort((a, b) => b.score - a.score);

  return [
    {
      type: "PLAYER_ANSWERED",
      playerId: PLAYER_ID,
      answerId,
      correct,
      timestamp: now,
    },
    {
      type: "SCORE_UPDATED",
      playerId: PLAYER_ID,
      score: cumulativeScore,
      timestamp: now + 80,
    },
    {
      type: "NPC_MESSAGE",
      npcId: "seller-mei",
      text: correct
        ? "一共五十二元。谢谢！"
        : "我们可以继续点菜。需要账单的时候说「请给我账单」。",
      pinyin: correct
        ? "Yigong wushi'er yuan. Xiexie!"
        : "Women keyi jixu dian cai. Xuyao zhangdan de shihou shuo 'Qing gei wo zhangdan'.",
      translation: correct
        ? "That's 52 yuan in total. Thank you!"
        : "We can continue ordering. When you need the bill, say 'Please give me the bill'.",
      timestamp: now + 180,
    },
    {
      type: "WORD_UNLOCKED",
      wordId: "zhangdan",
      hanzi: "账单",
      pinyin: "zhangdan",
      meaning: "bill / счёт",
      timestamp: now + 260,
    },
    {
      type: "WORD_UNLOCKED",
      wordId: "xiexie",
      hanzi: "谢谢",
      pinyin: "xiexie",
      meaning: "thank you / спасибо",
      timestamp: now + 320,
    },
    {
      type: "LEADERBOARD_UPDATED",
      players,
      timestamp: now + 360,
    },
    {
      type: "QUEST_COMPLETED",
      questId: QUEST_ID,
      reward: {
        xp: cumulativeScore,
        title: "Shanghai Regular",
        unlockedBadge: "Full Meal",
      },
      timestamp: now + 900,
    },
  ];
}

export const createAnswerEvents = (answerId: string): GameEvent[] => {
  switch (currentStep) {
    case "drink": {
      currentStep = "food";
      return createDrinkAnswerEvents(answerId);
    }
    case "food": {
      currentStep = "bill";
      return createFoodAnswerEvents(answerId);
    }
    case "bill": {
      return createBillAnswerEvents(answerId);
    }
  }
};

export const createFakePlayerEvent = (): GameEvent => {
  const fakeAnswers = [
    { playerId: "lin", answerId: "answer-tea", correct: true },
    { playerId: "masha", answerId: "answer-tea", correct: true },
    { playerId: "alex", answerId: "answer-station", correct: false },
    { playerId: "lin", answerId: "answer-dumplings", correct: true },
    { playerId: "masha", answerId: "answer-noodles", correct: false },
    { playerId: "alex", answerId: "answer-bill", correct: true },
  ];
  const selected = fakeAnswers[Math.floor(Math.random() * fakeAnswers.length)];

  return {
    type: "PLAYER_ANSWERED",
    ...selected,
    timestamp: createTimestamp(),
  };
};
