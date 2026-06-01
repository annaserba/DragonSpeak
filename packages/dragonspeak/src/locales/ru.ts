import type { en } from "./en";

export const ru: typeof en = {
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
    title: "Shared package + event-driven app",
    subtitle:
      "DragonSpeak-demo использует reusable пакет dragonspeak: события квеста, reducer, mock realtime transport, переводы и lazy-loaded Three.js сцену ресторана.",
    eventTitle: "Типизированный поток событий",
    eventText:
      "Shared package экспортирует сериализуемые domain events: NPC_MESSAGE, PLAYER_ANSWERED, WORD_UNLOCKED и QUEST_COMPLETED.",
    machineTitle: "Quest state machine",
    machineText:
      "Consuming app отправляет intent игрока в MockQuestSocket. Только reducer из пакета превращает события в состояние квеста, счет, прогресс и награды.",
    socketTitle: "WebSocket mock",
    socketText:
      "MockQuestSocket живет в shared package и отправляет старт, диалог, варианты, ответы fake players, leaderboard, latency, reconnect и burst-friendly events.",
    demoTitle: "Demo vs commercial",
    demoText:
      "В публичных репозиториях нет секретов, платных API, платежей и реального AI. Коммерческие сервисы можно подключить за тем же event contract.",
    layoutTitle: "Актуальное разделение модулей",
  },
};
