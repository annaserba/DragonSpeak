import type { Choice, Language } from "../events";
import type { DialogueLine } from "../state";

const dialogueRu: Record<string, string> = {
  "欢迎光临！你想喝点什么？": "Добро пожаловать! Что вы хотите выпить?",
  "很好！请稍等。": "Очень хорошо! Пожалуйста, подождите немного.",
  "差一点。点茶可以说：我要一杯茶。":
    "Почти. Чтобы заказать чай, можно сказать: «Я хочу чашку чая».",
  "你想吃点什么？": "Что вы хотите поесть?",
  "好的，马上来！": "Хорошо, сейчас принесу!",
  "不好意思，我们这里没有。你试试饺子吧！": "Извините, у нас такого нет. Попробуйте пельмени!",
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

const tickRu: Record<string, string> = {
  "Lin joined the Shanghai room": "Лин присоединилась к комнате Шанхай",
  "Masha is reviewing tones": "Маша повторяет тоны",
  "Alex unlocked 请": "Алекс открыл 请",
  "Demo server batched 3 events": "Demo сервер объединил 3 события",
};

export const translateDialogue = (dialogue: DialogueLine, language: Language) =>
  language === "ru" ? (dialogueRu[dialogue.text] ?? dialogue.translation) : dialogue.translation;

export const translateChoice = (choice: Choice, language: Language) =>
  language === "ru" ? (choiceRu[choice.id] ?? choice.translation) : choice.translation;

export const translateTick = (tick: string, language: Language) =>
  language === "ru" ? (tickRu[tick] ?? tick) : tick;
