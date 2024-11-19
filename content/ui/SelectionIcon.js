export class SelectionIcon {
  constructor() {
    console.log("TransMatrix: SelectionIcon constructor called");
    this.element = null;
    this.createIcon();
  }

  createIcon() {
    console.log("TransMatrix: Creating selection icon");
    const existingIcon = document.querySelector(".transmatrix-icon");
    if (existingIcon) {
      console.log("TransMatrix: Removing existing icon");
      existingIcon.remove();
    }

    // Ensure document.body exists
    if (!document.body) {
      console.error(
        "TransMatrix: Cannot create icon - document.body is not available"
      );
      return;
    }

    this.element = document.createElement("div");
    this.element.className = "transmatrix-icon";
    this.element.style.display = "none"; // Ensure hidden by default
    // Use the icon from assets
    const iconUrl = chrome.runtime.getURL("assets/icon48.png");
    this.element.innerHTML = `<img src="${iconUrl}" width="24" height="24" alt="Translate">`;

    document.body.appendChild(this.element);
    console.log("TransMatrix: Selection icon created and added to DOM");
  }

  show(x, y) {
    console.log("TransMatrix: Show selection icon called", { x, y });
    if (!this.element) {
      console.log("TransMatrix: Creating icon in show()");
      this.createIcon();
    }

    const offset = 10;
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const iconWidth = 30; // Width of the icon
    const iconHeight = 30; // Height of the icon

    // Calculate position, ensuring icon stays within viewport
    let finalX = x + offset;
    if (finalX + iconWidth > viewportWidth) {
      finalX = x - offset - iconWidth;
    }

    let finalY = y + offset;
    if (finalY + iconHeight > viewportHeight) {
      finalY = y - offset - iconHeight;
    }

    this.element.style.left = `${finalX + scrollX}px`;
    this.element.style.top = `${finalY + scrollY}px`;
    this.element.style.display = "flex"; // Use flex for better SVG centering
    console.log("TransMatrix: Icon positioned and should be visible", {
      left: this.element.style.left,
      top: this.element.style.top,
      display: this.element.style.display,
    });
  }

  hide() {
    console.log("TransMatrix: Hide selection icon called");
    if (this.element) {
      this.element.style.display = "none";
    }
  }
}
