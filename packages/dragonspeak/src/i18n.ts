import type { Choice, Language } from "./events";
import type { DialogueLine } from "./state";

type Dictionary = typeof en;

const en = {
  nav: {
    home: "Home",
    quest: "Quest",
    vocabulary: "Vocabulary",
    architecture: "Architecture",
    subtitle: "Realtime Mandarin RPG",
  },
  language: {
    label: "Interface language",
    english: "EN",
    russian: "RU",
  },
  home: {
    eyebrow: "Public portfolio demo",
    title: "DragonSpeak",
    pitch:
      "A realtime gamified Mandarin learning platform where short RPG quests turn useful conversation into typed events, state transitions, and measurable progress.",
    start: "Start demo quest",
    architecture: "View architecture",
    marketLabel: "Market opportunity",
    mandarinTitle: "Mandarin learning",
    mandarinText:
      "Practical scenario-based lessons with hanzi, pinyin, English, and Russian context.",
    gameTitle: "Gamified education",
    gameText: "Progress, quests, words, rewards, and leaderboards make repetition feel purposeful.",
    realtimeTitle: "Realtime learning",
    realtimeText: "Mocked WebSocket events demonstrate multiplayer presence without paid APIs.",
    liveEvent: "Live event stream",
  },
  quest: {
    eyebrow: "Quest: Restaurant in Shanghai",
    title: "Three-course meal at Seller Mei's",
    step: "Step {current} of {total}",
    stepDrink: "Order a drink",
    stepFood: "Order food",
    stepBill: "Pay the bill",
    score: "Score",
    progress: "Quest progress",
    answers: "Answer choices",
    completed: "Quest completed",
    completedText: "unlocked, {xp} XP earned, badge: {badge}.",
    unlockedWords: "Unlocked words",
    wordsEmpty: "Words unlock after answering.",
    realtimeEvents: "Realtime events",
    presenceEmpty: "Presence events will appear soon.",
  },
  scene: {
    npc: "NPC Seller Mei",
    empty: "Connect to the demo server to receive NPC dialogue.",
  },
  choices: {
    waiting: "Waiting for the next server event...",
  },
  realtime: {
    title: "Realtime",
    status: "Status",
    latency: "Latency",
    buffer: "Buffer",
    start: "Start connection",
    reconnect: "Simulate reconnect",
    reset: "Reset demo",
  },
  leaderboard: {
    title: "Leaderboard",
    empty: "Leaderboard appears after the quest connects.",
    streak: "streak",
  },
  inspector: {
    title: "Developer Event Inspector",
    collapse: "Collapse developer event inspector",
    expand: "Expand developer event inspector",
    stream: "Event stream",
    empty: "No events yet.",
    state: "Current game state",
    events: "events",
    buffer: "buffer",
  },
  vocabulary: {
    eyebrow: "Vocabulary",
    title: "Unlocked Mandarin words",
    subtitle: "Paginated with TanStack Table and fed by the quest event stream.",
    hanzi: "Hanzi",
    pinyin: "Pinyin",
    meaning: "Meaning",
    status: "Status",
    page: "Page",
    of: "of",
    previous: "Previous page",
    next: "Next page",
  },
  architecture: {
    eyebrow: "Architecture",
    title: "Event-driven frontend demo",
    subtitle:
      "The public version replaces AI, billing, and production backend with deterministic mocks while preserving the frontend contracts a commercial product would need.",
    eventTitle: "Typed event stream",
    eventText:
      "Quest progress is represented as domain events such as NPC_MESSAGE, PLAYER_ANSWERED, WORD_UNLOCKED, and QUEST_COMPLETED.",
    machineTitle: "Quest state machine",
    machineText:
      "UI controls dispatch player intent to the mock socket. The reducer is the only layer that turns events into quest state, score, progress, and rewards.",
    socketTitle: "WebSocket mock",
    socketText:
      "A local server simulation emits starts, dialogue, choices, fake player answers, leaderboard changes, latency, reconnects, and buffered bursts.",
    demoTitle: "Demo vs commercial",
    demoText:
      "Public demo code has no secrets, paid APIs, payment flows, or real AI. Commercial services can be added behind the same event contract.",
    layoutTitle: "Modular layout",
  },
};

const ru: Dictionary = {
  nav: {
    home: "Главная",
    quest: "Квест",
    vocabulary: "Слова",
    architecture: "Архитектура",
    subtitle: "Realtime Mandarin RPG",
  },
  language: {
    label: "Язык интерфейса",
    english: "EN",
    russian: "RU",
  },
  home: {
    eyebrow: "Публичная portfolio demo",
    title: "DragonSpeak",
    pitch:
      "Realtime-платформа для изучения китайского в игровом формате: короткие RPG-квесты превращают живые диалоги в типизированные события, переходы состояния и измеримый прогресс.",
    start: "Начать демо-квест",
    architecture: "Смотреть архитектуру",
    marketLabel: "Рыночная возможность",
    mandarinTitle: "Изучение Mandarin",
    mandarinText:
      "Практичные сценарные уроки с иероглифами, пиньинем, английским и русским контекстом.",
    gameTitle: "Геймификация обучения",
    gameText: "Прогресс, квесты, слова, награды и лидерборд делают повторение осмысленным.",
    realtimeTitle: "Realtime-обучение",
    realtimeText: "Mock WebSocket показывает мультиплеерное присутствие без платных API.",
    liveEvent: "Поток событий",
  },
  quest: {
    eyebrow: "Квест: ресторан в Шанхае",
    title: "Обед из трёх блюд у продавца Мэй",
    step: "Шаг {current} из {total}",
    stepDrink: "Заказать напиток",
    stepFood: "Заказать еду",
    stepBill: "Оплатить счёт",
    score: "Счет",
    progress: "Прогресс квеста",
    answers: "Варианты ответа",
    completed: "Квест завершен",
    completedText: "открыт, {xp} XP получено, бейдж: {badge}.",
    unlockedWords: "Открытые слова",
    wordsEmpty: "Слова откроются после ответа.",
    realtimeEvents: "События реального времени",
    presenceEmpty: "События присутствия появятся скоро.",
  },
  scene: {
    npc: "NPC продавец Мэй",
    empty: "Подключитесь к demo server, чтобы получить реплику NPC.",
  },
  choices: {
    waiting: "Ждем следующее событие от сервера...",
  },
  realtime: {
    title: "Realtime",
    status: "Статус",
    latency: "Задержка",
    buffer: "Буфер",
    start: "Запустить подключение",
    reconnect: "Симулировать reconnect",
    reset: "Сбросить демо",
  },
  leaderboard: {
    title: "Лидерборд",
    empty: "Лидерборд появится после подключения квеста.",
    streak: "серия",
  },
  inspector: {
    title: "Developer Event Inspector",
    collapse: "Свернуть developer inspector",
    expand: "Развернуть developer inspector",
    stream: "Поток событий",
    empty: "Событий пока нет.",
    state: "Текущее состояние игры",
    events: "событий",
    buffer: "буфер",
  },
  vocabulary: {
    eyebrow: "Словарь",
    title: "Открытые слова Mandarin",
    subtitle: "Пагинация на TanStack Table, данные приходят из event stream квеста.",
    hanzi: "Иероглифы",
    pinyin: "Пиньинь",
    meaning: "Значение",
    status: "Статус",
    page: "Страница",
    of: "из",
    previous: "Предыдущая страница",
    next: "Следующая страница",
  },
  architecture: {
    eyebrow: "Архитектура",
    title: "Event-driven frontend demo",
    subtitle:
      "Публичная версия заменяет AI, billing и production backend детерминированными mock-слоями, но сохраняет frontend-контракты коммерческого продукта.",
    eventTitle: "Типизированный поток событий",
    eventText:
      "Прогресс квеста описан доменными событиями: NPC_MESSAGE, PLAYER_ANSWERED, WORD_UNLOCKED и QUEST_COMPLETED.",
    machineTitle: "Quest state machine",
    machineText:
      "UI отправляет намерение игрока в mock socket. Только reducer превращает события в состояние квеста, счет, прогресс и награды.",
    socketTitle: "WebSocket mock",
    socketText:
      "Локальная симуляция сервера отправляет старт, диалог, варианты, ответы fake players, лидерборд, latency, reconnect и burst buffering.",
    demoTitle: "Demo vs commercial",
    demoText:
      "В публичном demo нет секретов, платных API, платежей и реального AI. Коммерческие сервисы можно подключить за тем же event contract.",
    layoutTitle: "Модульная структура",
  },
};

export const dictionaries = { en, ru };

export const getDictionary = (language: Language) => dictionaries[language];

const dialogueRu: Record<string, string> = {
  "欢迎光临！你想喝点什么？": "Добро пожаловать! Что вы хотите выпить?",
  "很好！请稍等。": "Очень хорошо! Пожалуйста, подождите немного.",
  "差一点。点茶可以说：我要一杯茶。":
    "Почти. Чтобы заказать чай, можно сказать: «Я хочу чашку чая».",
  "你想吃点什么？": "Что вы хотите поесть?",
  "好的，马上来！": "Хорошо, сейчас принесу!",
  "不好意思，我们这里没有。你试试饺子吧！":
    "Извините, у нас такого нет. Попробуйте пельмени!",
  "还需要什么吗？": "Что-нибудь ещё?",
  "一共五十二元。谢谢！": "Всего 52 юаня. Спасибо!",
  "我们可以继续点菜。需要账单的时候说「请给我账单」。":
    "Можем продолжить заказывать. Когда нужен счёт, скажите «Дайте счёт пожалуйста».",
};

const choiceRu: Record<string, string> = {
  "answer-tea": "Я хочу чашку чая.",
  "answer-station": "Где находится станция метро?",
  "answer-price": "Как вас зовут?",
  "answer-dumplings": "Я хочу пельмени.",
  "answer-noodles": "Я хочу лапшу.",
  "answer-price-food": "Сколько это стоит?",
  "answer-bill": "Дайте счёт, пожалуйста.",
  "answer-more-tea": "Ещё одну чашку чая.",
  "answer-bathroom": "Где туалет?",
};

export const translateDialogue = (dialogue: DialogueLine, language: Language) =>
  language === "ru" ? (dialogueRu[dialogue.text] ?? dialogue.translation) : dialogue.translation;

export const translateChoice = (choice: Choice, language: Language) =>
  language === "ru" ? (choiceRu[choice.id] ?? choice.translation) : choice.translation;

const tickRu: Record<string, string> = {
  "Lin joined the Shanghai room": "Лин присоединилась к комнате Шанхай",
  "Masha is reviewing tones": "Маша повторяет тоны",
  "Alex unlocked 请": "Алекс открыл 请",
  "Demo server batched 3 events": "Demo сервер объединил 3 события",
};

export const translateTick = (tick: string, language: Language) =>
  language === "ru" ? (tickRu[tick] ?? tick) : tick;
