import type { Language } from "./events";
import { en } from "./locales/en";
import { ru } from "./locales/ru";

export type Dictionary = typeof en;

export const dictionaries = { en, ru } satisfies Record<Language, Dictionary>;

export const getDictionary = (language: Language) => dictionaries[language];

export { translateChoice, translateDialogue, translateTick } from "./locales/mandarinTranslations";
