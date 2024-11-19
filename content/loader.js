// Initialize components and expose them globally
const initializeComponents = async () => {
  try {
    // Wait for document to be ready
    if (document.readyState === "loading") {
      await new Promise((resolve) =>
        document.addEventListener("DOMContentLoaded", resolve)
      );
    }

    // Create a map of module paths and their corresponding global variable names
    const modules = [
      {
        path: "content/translationService.js",
        className: "TranslationService",
        globalName: "translationService",
      },
      {
        path: "content/ui/SelectionIcon.js",
        className: "SelectionIcon",
        globalName: "selectionIcon",
      },
      {
        path: "content/ui/FloatingWindow.js",
        className: "FloatingWindow",
        globalName: "floatingWindow",
      },
    ];

    // Import and initialize each module
    for (const module of modules) {
      try {
        const imported = await import(chrome.runtime.getURL(module.path));

        if (!imported[module.className]) {
          throw new Error(
            `Class ${module.className} not found in module ${module.path}`
          );
        }

        window[module.globalName] = new imported[module.className]();

        if (!window[module.globalName]) {
          throw new Error(`Failed to initialize ${module.className}`);
        }
      } catch (moduleError) {
        console.error(
          `TransMatrix: Error loading module ${module.path}:`,
          moduleError
        );
        throw moduleError;
      }
    }

    return true;
  } catch (error) {
    console.error("TransMatrix: Error initializing components:", error);
    return false;
  }
};

// Initialize content script
const initializeContentScript = async () => {
  try {
    const contentModule = await import(
      chrome.runtime.getURL("content/main.js")
    );

    if (!contentModule) {
      throw new Error("Failed to load main.js module");
    }

    if (typeof contentModule.initialize !== "function") {
      throw new Error("initialize function not found in content script");
    }

    await contentModule.initialize();
  } catch (error) {
    console.error("TransMatrix: Error initializing content script:", error);
    throw error;
  }
};

// Main initialization sequence with retries
(async () => {
  let retries = 3;

  while (retries > 0) {
    try {
      const componentsInitialized = await initializeComponents();
      if (componentsInitialized) {
        await initializeContentScript();
        break;
      } else {
        throw new Error("Component initialization failed");
      }
    } catch (error) {
      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      } else {
        console.error("TransMatrix: All initialization attempts failed");
      }
    }
  }
})();
