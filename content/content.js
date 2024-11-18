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
  console.log("TransMatrix: Translation service settings updated", settings);
};

// Initialize event listeners
export const initialize = async () => {
  console.log("TransMatrix: Setting up event listeners...");

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
    console.log("TransMatrix: Initial settings loaded", currentSettings);
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
      console.log("TransMatrix: Settings updated", currentSettings);
    }
  });

  const handleMouseUp = async (event) => {
    try {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text !== selectedText) {
        selectedText = text;
        console.log("TransMatrix: Showing selection icon");
        window.selectionIcon.show(event.clientX, event.clientY);
      } else if (!text) {
        selectedText = "";
        console.log("TransMatrix: Hiding selection icon");
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
        console.log("TransMatrix: Icon clicked, initiating translation");
        window.selectionIcon.hide();
        isWindowVisible = true;

        // Show window with loader first
        window.floatingWindow.show(event.clientX, event.clientY);

        // Get translations using current settings
        const translations = await window.translationService.translateToAll(
          selectedText
        );
        console.log("TransMatrix: Translations received", translations);

        // Update window with translations
        window.floatingWindow.setTranslations(translations);
        return;
      }

      // Handle clicks outside the floating window
      if (isWindowVisible && !event.target.closest(".transmatrix-window")) {
        console.log("TransMatrix: Click outside window, hiding window");
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

  console.log("TransMatrix: Event listeners initialized successfully");
};
