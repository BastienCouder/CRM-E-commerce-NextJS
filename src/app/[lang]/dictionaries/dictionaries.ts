type Dictionary = {
  [key: string]: any;
};

// Dictionnaires disponibles
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () =>
    import("@/app/[lang]/dictionaries/en.json").then(
      (module) => module.default
    ),
  fr: () =>
    import("@/app/[lang]/dictionaries/fr.json").then(
      (module) => module.default
    ),
};

// Fonction pour obtenir le dictionnaire
export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    throw new Error(`Dictionnaire pour la locale '${locale}' introuvable.`);
  }

  return dictionaries[locale]();
};
