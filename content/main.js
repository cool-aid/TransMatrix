import { DEFAULT_SETTINGS } from "../utils/constants.js";

let selectedText = "";
let isWindowVisible = false;
let currentSettings = null;

// Verify components exist
const verifyComponents = () => {
  const components = {
    translationService: window.translationService,
    selectionIcon: window.selectionIcon,
    floatingWindow: window.floatingWindow,
  };

  const missing = Object.entries(components)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(`TransMatrix: Missing components: ${missing.join(", ")}`);
    return false;
  }
  return true;
};

// Update translation service settings
const updateTranslationSettings = (settings) => {
  if (!window.translationService) {
    console.error("TransMatrix: Translation service not available");
    return;
  }
  window.translationService.updateSettings(settings);
};

// Initialize event listeners
export const initialize = async () => {
  // Verify components before setting up listeners
  if (!verifyComponents()) {
    console.error(
      "TransMatrix: Cannot initialize event listeners - missing components"
    );
    return;
  }

  // Load initial settings
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    currentSettings = result;
    updateTranslationSettings(currentSettings);
  } catch (error) {
    console.error("TransMatrix: Error loading initial settings:", error);
  }

  // Listen for settings changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      if (changes.sourceLanguage) {
        currentSettings.sourceLanguage = changes.sourceLanguage.newValue;
      }
      if (changes.targetLanguages) {
        currentSettings.targetLanguages = changes.targetLanguages.newValue;
      }
      updateTranslationSettings(currentSettings);
    }
  });

  const handleMouseUp = async (event) => {
    try {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text !== selectedText) {
        selectedText = text;
        window.selectionIcon.show(event.clientX, event.clientY);
      } else if (!text) {
        selectedText = "";
        window.selectionIcon.hide();
      }
    } catch (error) {
      console.error("TransMatrix: Error in mouseup handler:", error);
    }
  };

  const handleClick = async (event) => {
    try {
      // Handle translation icon click
      if (event.target.closest(".transmatrix-icon")) {
        event.preventDefault();
        window.selectionIcon.hide();
        isWindowVisible = true;

        // Show window with loader first
        window.floatingWindow.show(event.clientX, event.clientY);

        // Get translations using current settings
        const translations = await window.translationService.translateToAll(
          selectedText
        );

        // Update window with translations
        window.floatingWindow.setTranslations(translations);
        return;
      }

      // Handle clicks outside the floating window
      if (isWindowVisible && !event.target.closest(".transmatrix-window")) {
        window.floatingWindow.hide();
        isWindowVisible = false;
        return;
      }
    } catch (error) {
      console.error("TransMatrix: Error in click handler:", error);
    }
  };

  // Add event listeners
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("click", handleClick);
};
