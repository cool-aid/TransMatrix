import { SUPPORTED_LANGUAGES, STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants.js';

document.addEventListener("DOMContentLoaded", async () => {
  const sourceLanguageSearch = document.getElementById("sourceLanguageSearch");
  const sourceLanguageDropdown = document.getElementById("sourceLanguageDropdown");
  const selectedSourceLanguage = document.getElementById("selectedSourceLanguage");
  const searchInput = document.getElementById("languageSearch");
  const dropdownContent = document.getElementById("languageDropdown");
  const selectedLanguagesContainer = document.getElementById("selectedLanguages");
  const saveButton = document.getElementById("saveButton");
  
  let selectedLanguages = new Set();
  let currentSourceLanguage = DEFAULT_SETTINGS[STORAGE_KEYS.SOURCE_LANGUAGE];

  // Load saved settings
  const settings = await chrome.storage.sync.get([
    STORAGE_KEYS.SOURCE_LANGUAGE,
    STORAGE_KEYS.TARGET_LANGUAGES,
  ]);
  
  if (settings[STORAGE_KEYS.SOURCE_LANGUAGE]) {
    currentSourceLanguage = settings[STORAGE_KEYS.SOURCE_LANGUAGE];
  }

  if (settings[STORAGE_KEYS.TARGET_LANGUAGES]) {
    selectedLanguages = new Set(settings[STORAGE_KEYS.TARGET_LANGUAGES]);
  }

  updateSelectedLanguagesDisplay();
  updateSourceLanguageDisplay();

  function updateSourceLanguageDisplay() {
    if (currentSourceLanguage === 'auto') {
      selectedSourceLanguage.textContent = 'Auto Detect';
    } else {
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === currentSourceLanguage);
      selectedSourceLanguage.textContent = lang ? lang.name : '';
    }
  }

  function updateSelectedLanguagesDisplay() {
    selectedLanguagesContainer.innerHTML = '';
    selectedLanguages.forEach(langCode => {
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
      if (lang) {
        const langElement = document.createElement('div');
        langElement.className = 'selected-language';
        langElement.innerHTML = `
          ${lang.name}
          <span class="remove-language" data-code="${lang.code}">×</span>
        `;
        selectedLanguagesContainer.appendChild(langElement);
      }
    });
  }

  function filterLanguages(searchText, dropdownElement, isSource = false) {
    let filtered = SUPPORTED_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!isSource ? !selectedLanguages.has(lang.code) : true)
    );

    dropdownElement.innerHTML = '';
    
    if (isSource) {
      const autoDetect = document.createElement('div');
      autoDetect.className = 'dropdown-item';
      autoDetect.textContent = 'Auto Detect';
      autoDetect.dataset.code = 'auto';
      dropdownElement.appendChild(autoDetect);
    }

    filtered.forEach(lang => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = lang.name;
      item.dataset.code = lang.code;
      dropdownElement.appendChild(item);
    });

    if (filtered.length > 0 || isSource) {
      dropdownElement.classList.add('show');
    } else {
      dropdownElement.classList.remove('show');
    }
  }

  sourceLanguageSearch.addEventListener('focus', () => {
    filterLanguages(sourceLanguageSearch.value, sourceLanguageDropdown, true);
  });

  sourceLanguageSearch.addEventListener('input', (e) => {
    filterLanguages(e.target.value, sourceLanguageDropdown, true);
  });

  searchInput.addEventListener('focus', () => {
    filterLanguages(searchInput.value, dropdownContent);
  });

  searchInput.addEventListener('input', (e) => {
    filterLanguages(e.target.value, dropdownContent);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.remove('show');
    }
    if (!sourceLanguageSearch.contains(e.target) && !sourceLanguageDropdown.contains(e.target)) {
      sourceLanguageDropdown.classList.remove('show');
    }
  });

  sourceLanguageDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
      currentSourceLanguage = item.dataset.code;
      updateSourceLanguageDisplay();
      sourceLanguageSearch.value = '';
      sourceLanguageDropdown.classList.remove('show');
    }
  });

  dropdownContent.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
      const langCode = item.dataset.code;
      if (selectedLanguages.size < 3) {
        selectedLanguages.add(langCode);
        updateSelectedLanguagesDisplay();
        searchInput.value = '';
        dropdownContent.classList.remove('show');
      } else {
        alert("You can only select up to 3 target languages");
      }
    }
  });

  selectedLanguagesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-language')) {
      const langCode = e.target.dataset.code;
      selectedLanguages.delete(langCode);
      updateSelectedLanguagesDisplay();
    }
  });

  saveButton.addEventListener("click", async () => {
    const settings = {
      [STORAGE_KEYS.SOURCE_LANGUAGE]: currentSourceLanguage,
      [STORAGE_KEYS.TARGET_LANGUAGES]: Array.from(selectedLanguages),
    };

    await chrome.storage.sync.set(settings);
    window.close();
  });
});
