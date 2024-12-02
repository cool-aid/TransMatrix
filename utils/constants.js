export const MAX_TARGET_LANGUAGES = 3;

export const SUPPORTED_LANGUAGES = [
  { code: "zh", name: "Chinese" },
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
];

export const STORAGE_KEYS = {
  SOURCE_LANGUAGE: "sourceLanguage",
  TARGET_LANGUAGES: "targetLanguages",
};

export const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.SOURCE_LANGUAGE]: "auto",
  [STORAGE_KEYS.TARGET_LANGUAGES]: ["zh", "ja", "ko"],
};
