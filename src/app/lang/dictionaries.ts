export type Dictionary = {
  [key: string]: any;
};
const defaultLocale = "fr";
// Dictionnaires disponibles
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("@/app/lang/en.json").then((module) => module.default),
  us: () => import("@/app/lang/us.json").then((module) => module.default),
  fr: () => import("@/app/lang/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    locale = defaultLocale;
  }

  return dictionaries[locale]();
};
