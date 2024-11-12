class TransMatrix {
    constructor() {
      this.selectedText = '';
      this.settings = null;
      this.setupEventListeners();
      this.loadSettings();
    }
  
    async loadSettings() {
      this.settings = await chrome.storage.sync.get({
        sourceLanguage: 'auto',
        targetLanguages: ['es', 'fr', 'de']
      });
    }
  
    setupEventListeners() {
      document.addEventListener('mouseup', this.handleSelection.bind(this));
      document.addEventListener('click', this.handleClick.bind(this));
      chrome.storage.onChanged.addListener(this.handleSettingsChange.bind(this));
    }
  
    handleSettingsChange(changes) {
      if (changes.sourceLanguage || changes.targetLanguages) {
        this.loadSettings();
      }
    }
  
    async handleSelection(event) {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
  
      if (selectedText && selectedText !== this.selectedText) {
        this.selectedText = selectedText;
        
        // Position the icon near the mouse position
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        
        window.selectionIcon.show(
          rect.right + scrollX,
          rect.top + scrollY
        );
  
        window.selectionIcon.setClickHandler(async () => {
          // Hide the icon when starting translation
          window.selectionIcon.hide();
  
          // Show loading state in floating window
          window.floatingWindow.show(
            rect.right + scrollX,
            rect.top + scrollY
          );
          window.floatingWindow.setContent({ 'Loading': 'Translating...' });
  
          // Start translation process
          await this.translateText(selectedText);
        });
      } else if (!selectedText) {
        this.handleClick(event);
      }
    }
  
    handleClick(event) {
      // Hide icon and window if clicking outside
      if (!event.target.closest('.transmatrix-window') && 
          !event.target.closest('.transmatrix-icon')) {
        window.selectionIcon.hide();
        window.floatingWindow.hide();
        this.selectedText = '';
      }
    }
  
    async translateText(text) {
      const translations = {};
      let sourceLang = this.settings.sourceLanguage;
  
      // Detect language if set to auto
      if (sourceLang === 'auto') {
        sourceLang = await window.translationService.detectLanguage(text);
        if (!sourceLang) {
          window.floatingWindow.setContent({ 
            'Error': 'Could not detect source language' 
          });
          return;
        }
        translations['Detected language'] = sourceLang;
      }
  
      // Translate to each target language
      for (const targetLang of this.settings.targetLanguages) {
        // Skip if target language is the same as source
        if (targetLang === sourceLang) {
          translations[this.getLanguageName(targetLang)] = text;
          continue;
        }
  
        const translation = await window.translationService.translate(
          text,
          sourceLang,
          targetLang
        );
  
        if (translation) {
          translations[this.getLanguageName(targetLang)] = translation;
        } else {
          translations[this.getLanguageName(targetLang)] = 'Translation failed';
        }
      }
  
      window.floatingWindow.setContent(translations);
    }
  
    getLanguageName(langCode) {
      const languages = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese'
      };
      return languages[langCode] || langCode;
    }
  }
  
  // Initialize TransMatrix
  new TransMatrix();