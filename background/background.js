// This is a copy of DEFAULT_SETTINGS from utils/constants.js
// It's duplicated here because service workers can't reliably import modules
// If you update this, make sure to update utils/constants.js as well
const DEFAULT_SETTINGS = {
  sourceLanguage: "auto",
  targetLanguages: ["zh", "ja", "ko"]
};

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set(DEFAULT_SETTINGS);
});