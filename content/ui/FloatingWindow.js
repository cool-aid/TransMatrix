class FloatingWindow {
  constructor() {
    this.element = null;
    this.createWindow();
  }

  createWindow() {
    this.element = document.createElement("div");
    this.element.className = "transmatrix-window";
    this.element.style.display = "none";

    const closeButton = document.createElement("button");
    closeButton.className = "transmatrix-close";
    closeButton.innerHTML = "×";
    closeButton.onclick = () => this.hide();

    this.content = document.createElement("div");
    this.content.className = "transmatrix-content";

    this.element.appendChild(closeButton);
    this.element.appendChild(this.content);
    document.body.appendChild(this.element);

    // Make the window draggable
    this.setupDraggable();
  }

  setupDraggable() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    const dragStart = (e) => {
      if (
        e.target.closest(".transmatrix-close") ||
        e.target.closest(".transmatrix-content")
      ) {
        return;
      }

      initialX = e.clientX - this.element.offsetLeft;
      initialY = e.clientY - this.element.offsetTop;
      isDragging = true;
    };

    const dragEnd = () => {
      isDragging = false;
    };

    const drag = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      this.element.style.left = `${currentX}px`;
      this.element.style.top = `${currentY}px`;
    };

    this.element.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
  }

  show(x, y) {
    this.element.style.display = "block";

    // Calculate the best position to show the window
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = this.element.offsetWidth;
    const windowHeight = this.element.offsetHeight;

    // Ensure the window doesn't go off-screen
    let finalX = Math.min(x, viewportWidth - windowWidth - 20);
    finalX = Math.max(finalX, 20); // Keep some margin from the left

    let finalY = y;
    // If the window would go off the bottom of the screen, position it above the selection
    if (y + windowHeight > viewportHeight - 20) {
      finalY = Math.max(20, viewportHeight - windowHeight - 20);
    }

    this.element.style.left = `${finalX}px`;
    this.element.style.top = `${finalY}px`;
  }

  hide() {
    this.element.style.display = "none";
  }

  setContent(translations) {
    this.content.innerHTML = "";

    for (const [lang, text] of Object.entries(translations)) {
      const translationDiv = document.createElement("div");
      translationDiv.className = "translation-item";

      const langLabel = document.createElement("div");
      langLabel.className = "language-label";
      langLabel.textContent = lang;

      const textDiv = document.createElement("div");
      textDiv.className = "translated-text";
      textDiv.textContent = text;

      translationDiv.appendChild(langLabel);
      translationDiv.appendChild(textDiv);
      this.content.appendChild(translationDiv);
    }
  }
}

window.floatingWindow = new FloatingWindow();
