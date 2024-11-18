export const MAX_TARGET_LANGUAGES = 3;

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

export const STORAGE_KEYS = {
  SOURCE_LANGUAGE: "sourceLanguage",
  TARGET_LANGUAGES: "targetLanguages",
};

export const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.SOURCE_LANGUAGE]: "auto",
  [STORAGE_KEYS.TARGET_LANGUAGES]: ["zh", "ja", "ko"],
};