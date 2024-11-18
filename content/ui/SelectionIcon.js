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

    this.element = document.createElement("div");
    this.element.className = "transmatrix-icon";
    this.element.style.display = "none"; // Ensure hidden by default
    this.element.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor"/>
      </svg>
    `;
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
