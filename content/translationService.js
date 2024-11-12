class TranslationService {
    constructor() {
      this.detector = null;
      this.translators = new Map();
    }
  
    async initializeDetector() {
      const canDetect = await window.translation.canDetect();
      if (canDetect !== 'no') {
        this.detector = await window.translation.createDetector();
        if (canDetect !== 'readily') {
          await this.detector.ready;
        }
      }
      return this.detector !== null;
    }
  
    async detectLanguage(text) {
      if (!this.detector) {
        const initialized = await this.initializeDetector();
        if (!initialized) return null;
      }
  
      const results = await this.detector.detect(text);
      return results[0]?.detectedLanguage || null;
    }
  
    async initializeTranslator(sourceLang, targetLang) {
      const languagePair = {
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      };
  
      const key = `${sourceLang}-${targetLang}`;
      if (this.translators.has(key)) {
        return true;
      }
  
      const canTranslate = await window.translation.canTranslate(languagePair);
      if (canTranslate !== 'no') {
        const translator = await window.translation.createTranslator(languagePair);
        if (canTranslate !== 'readily') {
          await translator.ready;
        }
        this.translators.set(key, translator);
        return true;
      }
      return false;
    }
  
    async translate(text, sourceLang, targetLang) {
      const key = `${sourceLang}-${targetLang}`;
      if (!this.translators.has(key)) {
        const initialized = await this.initializeTranslator(sourceLang, targetLang);
        if (!initialized) return null;
      }
  
      const translator = this.translators.get(key);
      try {
        return await translator.translate(text);
      } catch (error) {
        console.error('Translation error:', error);
        return null;
      }
    }
  }
  
  window.translationService = new TranslationService();