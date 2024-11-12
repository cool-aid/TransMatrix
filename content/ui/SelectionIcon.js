class SelectionIcon {
  constructor() {
    this.element = null;
    this.createIcon();
  }

  createIcon() {
    // Remove existing icon if it exists
    const existingIcon = document.querySelector('.transmatrix-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    this.element = document.createElement('div');
    this.element.className = 'transmatrix-icon';
    this.element.innerHTML = `
      <div class="icon-inner">
        🌐
      </div>
    `;
    this.element.style.display = 'none';
    this.element.style.position = 'absolute'; // Changed from fixed to absolute
    this.element.style.zIndex = '999999';    // Ensure it's above other elements
    document.body.appendChild(this.element);
  }

  show(x, y) {
    // Add offset to prevent icon from covering the text
    const offset = 10;
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate position ensuring icon stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const iconWidth = 30; // Width of the icon
    const iconHeight = 30; // Height of the icon

    // Adjust x position if icon would go off-screen
    let finalX = x + offset;
    if (finalX + iconWidth > viewportWidth) {
      finalX = x - iconWidth - offset;
    }

    // Adjust y position if icon would go off-screen
    let finalY = y + offset;
    if (finalY + iconHeight > viewportHeight) {
      finalY = y - iconHeight - offset;
    }

    this.element.style.left = `${finalX}px`;
    this.element.style.top = `${finalY}px`;
    this.element.style.display = 'block';
  }

  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  setClickHandler(handler) {
    if (this.element) {
      this.element.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handler();
      };
    }
  }
}

window.selectionIcon = new SelectionIcon();