console.log("TransMatrix: content-script-loader.js loaded");

// Initialize components and expose them globally
const initializeComponents = async () => {
  try {
    console.log("TransMatrix: Starting component initialization...");

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
        console.log(`TransMatrix: Loading ${module.path}...`);
        const imported = await import(chrome.runtime.getURL(module.path));

        if (!imported[module.className]) {
          throw new Error(
            `Class ${module.className} not found in module ${module.path}`
          );
        }

        console.log(`TransMatrix: Initializing ${module.className}...`);
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

    console.log("TransMatrix: Components initialized successfully", {
      translationService: !!window.translationService,
      selectionIcon: !!window.selectionIcon,
      floatingWindow: !!window.floatingWindow,
    });

    return true;
  } catch (error) {
    console.error("TransMatrix: Error initializing components:", error);
    return false;
  }
};

// Initialize content script
const initializeContentScript = async () => {
  try {
    console.log("TransMatrix: Loading content script...");
    const contentModule = await import(
      chrome.runtime.getURL("content/content.js")
    );

    if (!contentModule) {
      throw new Error("Failed to load content.js module");
    }

    console.log(
      "TransMatrix: Content script loaded, checking initialize function..."
    );

    if (typeof contentModule.initialize !== "function") {
      throw new Error("initialize function not found in content script");
    }

    console.log("TransMatrix: Running initialize function...");
    await contentModule.initialize();
    console.log("TransMatrix: Content script initialized successfully");
  } catch (error) {
    console.error("TransMatrix: Error initializing content script:", error);
    throw error;
  }
};

// Main initialization sequence with retries
(async () => {
  console.log("TransMatrix: Starting initialization sequence...");
  let retries = 3;

  while (retries > 0) {
    try {
      const componentsInitialized = await initializeComponents();
      if (componentsInitialized) {
        await initializeContentScript();
        console.log(
          "TransMatrix: Initialization sequence completed successfully"
        );
        break;
      } else {
        throw new Error("Component initialization failed");
      }
    } catch (error) {
      retries--;
      if (retries > 0) {
        console.log(
          `TransMatrix: Initialization failed, retrying... (${retries} attempts remaining)`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      } else {
        console.error("TransMatrix: All initialization attempts failed");
      }
    }
  }
})();
