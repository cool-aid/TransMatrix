import { DEFAULT_SETTINGS } from "../utils/constants.js";

let selectedText = "";

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
        console.log("TransMatrix: Hiding UI elements");
        window.selectionIcon.hide();
        window.floatingWindow.hide();
      }
    } catch (error) {
      console.error("TransMatrix: Error in mouseup handler:", error);
    }
  };

  const handleClick = async (event) => {
    try {
      if (event.target.closest(".transmatrix-icon")) {
        event.preventDefault();
        console.log("TransMatrix: Icon clicked, initiating translation");
        window.selectionIcon.hide();

        // Show window with loader first
        window.floatingWindow.show(event.clientX, event.clientY);

        // Get translations
        const translations = await window.translationService.translateToAll(
          selectedText
        );
        console.log("TransMatrix: Translations received", translations);

        // Update window with translations
        window.floatingWindow.setTranslations(translations);
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
