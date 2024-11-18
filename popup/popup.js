import { SUPPORTED_LANGUAGES } from '../utils/constants.js';


document.addEventListener("DOMContentLoaded", async () => {
  const targetContainer = document.getElementById("targetLanguages");
  const saveButton = document.getElementById("saveButton");
  const sourceLanguageSelect = document.getElementById("sourceLanguage");

  // Load saved settings
  const settings = await chrome.storage.sync.get([
    "sourceLanguage",
    "targetLanguages",
  ]);
  if (settings.sourceLanguage) {
    sourceLanguageSelect.value = settings.sourceLanguage;
  }

  // Create checkboxes for target languages
  SUPPORTED_LANGUAGES.forEach((lang) => {
    const div = document.createElement("div");
    div.className = "checkbox-group";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `lang-${lang.code}`;
    checkbox.value = lang.code;
    if (settings.targetLanguages?.includes(lang.code)) {
      checkbox.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = `lang-${lang.code}`;
    label.textContent = lang.name;

    div.appendChild(checkbox);
    div.appendChild(label);
    targetContainer.appendChild(div);
  });

  // Add event listener for checkboxes to limit selection to 3
  targetContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const checked = targetContainer.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      if (checked.length > 3 && e.target.checked) {
        e.target.checked = false;
        alert("You can only select up to 3 target languages");
      }
    }
  });

  // Save settings
  saveButton.addEventListener("click", async () => {
    const selectedTargetLanguages = Array.from(
      targetContainer.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => cb.value);

    await chrome.storage.sync.set({
      sourceLanguage: sourceLanguageSelect.value,
      targetLanguages: selectedTargetLanguages,
    });

    window.close();
  });
});
