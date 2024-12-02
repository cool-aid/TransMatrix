import { SUPPORTED_LANGUAGES } from '../utils/constants.js';

document.addEventListener("DOMContentLoaded", async () => {
  const sourceLanguageSelect = document.getElementById("sourceLanguage");
  const saveButton = document.getElementById("saveButton");
  const searchInput = document.getElementById("languageSearch");
  const dropdownContent = document.getElementById("languageDropdown");
  const selectedLanguagesContainer = document.getElementById("selectedLanguages");
  
  let selectedLanguages = new Set();

  // Load saved settings
  const settings = await chrome.storage.sync.get([
    "sourceLanguage",
    "targetLanguages",
  ]);
  
  if (settings.sourceLanguage) {
    sourceLanguageSelect.value = settings.sourceLanguage;
  }

  if (settings.targetLanguages) {
    selectedLanguages = new Set(settings.targetLanguages);
    updateSelectedLanguagesDisplay();
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

  function filterLanguages(searchText) {
    const filtered = SUPPORTED_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(searchText.toLowerCase()) &&
      !selectedLanguages.has(lang.code)
    );

    dropdownContent.innerHTML = '';
    filtered.forEach(lang => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = lang.name;
      item.dataset.code = lang.code;
      dropdownContent.appendChild(item);
    });

    if (filtered.length > 0) {
      dropdownContent.classList.add('show');
    } else {
      dropdownContent.classList.remove('show');
    }
  }

  searchInput.addEventListener('focus', () => {
    filterLanguages(searchInput.value);
  });

  searchInput.addEventListener('input', (e) => {
    filterLanguages(e.target.value);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.remove('show');
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
      sourceLanguage: sourceLanguageSelect.value,
      targetLanguages: Array.from(selectedLanguages),
    };

    await chrome.storage.sync.set(settings);
    window.close();
  });
});
