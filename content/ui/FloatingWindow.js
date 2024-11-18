export class FloatingWindow {
  constructor() {
    console.log("TransMatrix: FloatingWindow constructor called");
    this.element = null;
    this.content = null;
    this.isDragging = false;
    this.createWindow();
  }

  createWindow() {
    if (this.element) {
      return;
    }

    console.log("TransMatrix: Creating floating window");
    this.element = document.createElement("div");
    this.element.className = "transmatrix-window";
    this.element.style.display = "none";
    this.element.style.position = "fixed";
    this.element.style.left = "0";
    this.element.style.top = "0";

    // Create header for dragging
    const header = document.createElement("div");
    header.className = "transmatrix-header";

    const closeButton = document.createElement("button");
    closeButton.className = "transmatrix-close";
    closeButton.innerHTML = "×";
    closeButton.addEventListener("click", () => this.hide());

    header.appendChild(closeButton);

    this.content = document.createElement("div");
    this.content.className = "transmatrix-content";

    this.element.appendChild(header);
    this.element.appendChild(this.content);
    document.body.appendChild(this.element);
    console.log("TransMatrix: Floating window created and added to DOM");

    this.setupDragging(header);
  }

  setupDragging(header) {
    let currentX = 0;
    let currentY = 0;
    let initialX;
    let initialY;

    const dragStart = (e) => {
      // Only allow dragging from header, excluding close button
      if (e.target.closest(".transmatrix-close")) {
        return;
      }

      if (e.type === "mousedown") {
        const rect = this.element.getBoundingClientRect();
        currentX = rect.left;
        currentY = rect.top;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        this.isDragging = true;
        header.style.cursor = "grabbing";
      }
    };

    const dragEnd = () => {
      this.isDragging = false;
      header.style.cursor = "grab";
    };

    const drag = (e) => {
      if (this.isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        this.updatePosition(currentX, currentY);
      }
    };

    // Add grab cursor to indicate draggable
    header.style.cursor = "grab";

    // Add event listeners to header only
    header.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    // Prevent text selection while dragging
    header.addEventListener("selectstart", (e) => {
      if (this.isDragging) e.preventDefault();
    });
  }

  updatePosition(x, y) {
    console.log("TransMatrix: Updating window position", { x, y });
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = this.element.offsetWidth;
    const windowHeight = this.element.offsetHeight;

    // Keep window within viewport bounds
    let finalX = Math.min(Math.max(x, 20), viewportWidth - windowWidth - 20);
    let finalY = Math.min(Math.max(y, 20), viewportHeight - windowHeight - 20);

    this.element.style.left = `${finalX}px`;
    this.element.style.top = `${finalY}px`;
    console.log("TransMatrix: Window position updated", { finalX, finalY });
  }

  showLoader() {
    if (!this.content) return;

    this.content.innerHTML = `
      <div class="transmatrix-loader">
        <div class="transmatrix-loader-spinner"></div>
        <div class="transmatrix-loader-text">Translating...</div>
      </div>
    `;
  }

  show(x, y) {
    console.log("TransMatrix: Show floating window called", { x, y });
    if (!this.element) {
      console.log("TransMatrix: Creating window in show()");
      this.createWindow();
    }

    // Make visible first so we can get dimensions
    this.element.style.display = "block";

    // Show loader initially
    this.showLoader();

    // Get window dimensions after making it visible
    const windowWidth = this.element.offsetWidth;
    const windowHeight = this.element.offsetHeight;

    // Adjust position to not go off screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = Math.min(x, viewportWidth - windowWidth - 20);
    finalX = Math.max(finalX, 20);

    let finalY = Math.min(y, viewportHeight - windowHeight - 20);
    finalY = Math.max(finalY, 20);

    this.element.style.left = `${finalX}px`;
    this.element.style.top = `${finalY}px`;

    console.log("TransMatrix: Window should now be visible at", {
      finalX,
      finalY,
    });
  }

  hide() {
    console.log("TransMatrix: Hide floating window called");
    if (this.element) {
      this.element.style.display = "none";
    }
  }

  setTranslations(translations) {
    console.log("TransMatrix: Setting translations", translations);
    if (!this.content) {
      console.warn("TransMatrix: Content element not found");
      return;
    }

    this.content.innerHTML = "";
    for (const [lang, text] of Object.entries(translations)) {
      const translationDiv = document.createElement("div");
      translationDiv.className = "translation-item";

      const langLabel = document.createElement("div");
      langLabel.className = "translation-language";
      langLabel.textContent = lang.toUpperCase();
      translationDiv.appendChild(langLabel);

      const textDiv = document.createElement("div");
      textDiv.className = "translation-text";
      textDiv.textContent = text;
      translationDiv.appendChild(textDiv);

      this.content.appendChild(translationDiv);
    }
    console.log("TransMatrix: Translations rendered");
  }
}
