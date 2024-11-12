// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({
    sourceLanguage: "auto",
    targetLanguages: ["es", "fr", "de"],
  });
});
