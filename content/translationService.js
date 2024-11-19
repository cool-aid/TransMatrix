import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../utils/constants.js";

export class TranslationService {
  constructor() {
    this.detector = null;
    this.translators = new Map();
    this.settings = null;
    this.initialize();
  }

  async initialize() {
    // Load initial settings
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    this.settings = settings;

    // Listen for settings updates
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "SETTINGS_UPDATED") {
        this.settings = message.settings;
        this.translators.clear();
      }
    });
  }

  updateSettings(settings) {
    this.settings = settings;
    this.translators.clear(); // Clear cached translators when settings change
  }

  async initializeDetector() {
    const canDetect = await window.translation.canDetect();
    if (canDetect === "no") return false;

    this.detector = await window.translation.createDetector();
    if (canDetect !== "readily") {
      await this.detector.ready;
    }
    return true;
  }

  async detectLanguage(text) {
    if (!this.detector && !(await this.initializeDetector())) {
      return null;
    }

    const [result] = await this.detector.detect(text);
    return result?.detectedLanguage ?? null;
  }

  async initializeTranslator(sourceLang, targetLang) {
    const key = `${sourceLang}-${targetLang}`;
    if (this.translators.has(key)) return true;

    const languagePair = {
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    };
    const canTranslate = await window.translation.canTranslate(languagePair);

    if (canTranslate === "no") return false;

    const translator = await window.translation.createTranslator(languagePair);
    if (canTranslate !== "readily") {
      await translator.ready;
    }

    this.translators.set(key, translator);
    return true;
  }

  async translate(text, sourceLang, targetLang) {
    if (!(await this.initializeTranslator(sourceLang, targetLang))) {
      throw new Error(
        `Translation not available for ${sourceLang} to ${targetLang}`
      );
    }

    const key = `${sourceLang}-${targetLang}`;
    const translator = this.translators.get(key);
    return await translator.translate(text);
  }

  async translateToAll(text) {
    // Detect source language if not specified
    const sourceLang =
      (await this.detectLanguage(text)) ||
      this.settings[STORAGE_KEYS.SOURCE_LANGUAGE];
    const translations = {};

    if (!sourceLang) {
      return { error: "Could not detect source language" };
    }

    const targetLanguages =
      this.settings[STORAGE_KEYS.TARGET_LANGUAGES] ||
      DEFAULT_SETTINGS[STORAGE_KEYS.TARGET_LANGUAGES];

    await Promise.all(
      targetLanguages.map(async (targetLang) => {
        try {
          if (targetLang === sourceLang) {
            translations[targetLang] = text;
          } else {
            translations[targetLang] = await this.translate(
              text,
              sourceLang,
              targetLang
            );
          }
        } catch (error) {
          console.error(`Translation failed for ${targetLang}:`, error);
          translations[targetLang] = `Translation failed: ${error.message}`;
        }
      })
    );

    return translations;
  }
}
