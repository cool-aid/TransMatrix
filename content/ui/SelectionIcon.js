class SelectionIcon {
    constructor() {
      this.element = null;
      this.createIcon();
    }
  
    createIcon() {
      this.element = document.createElement('div');
      this.element.className = 'transmatrix-icon';
      this.element.innerHTML = '🌐';
      this.element.style.display = 'none';
      document.body.appendChild(this.element);
    }
  
    show(x, y) {
      this.element.style.display = 'block';
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  
    hide() {
      this.element.style.display = 'none';
    }
  
    setClickHandler(handler) {
      this.element.onclick = handler;
    }
  }
  
  window.selectionIcon = new SelectionIcon();