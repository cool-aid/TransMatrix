class FloatingWindow {
    constructor() {
      this.element = null;
      this.createWindow();
    }
  
    createWindow() {
      this.element = document.createElement('div');
      this.element.className = 'transmatrix-window';
      this.element.style.display = 'none';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'transmatrix-close';
      closeButton.innerHTML = '×';
      closeButton.onclick = () => this.hide();
      
      this.content = document.createElement('div');
      this.content.className = 'transmatrix-content';
      
      this.element.appendChild(closeButton);
      this.element.appendChild(this.content);
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
  
    setContent(translations) {
      this.content.innerHTML = '';
      
      for (const [lang, text] of Object.entries(translations)) {
        const translationDiv = document.createElement('div');
        translationDiv.className = 'translation-item';
        
        const langLabel = document.createElement('div');
        langLabel.className = 'language-label';
        langLabel.textContent = lang;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'translated-text';
        textDiv.textContent = text;
        
        translationDiv.appendChild(langLabel);
        translationDiv.appendChild(textDiv);
        this.content.appendChild(translationDiv);
      }
    }
  }
  
  window.floatingWindow = new FloatingWindow();