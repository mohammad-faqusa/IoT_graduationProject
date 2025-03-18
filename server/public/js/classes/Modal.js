class Modal {
    /**
     * Create a new modal instance
     * @param {Object} options - Configuration options for the modal
     */
    constructor(options = {}) {
        this.id = options.id || 'modal-' + Math.random().toString(36).substr(2, 9);
        this.title = options.title || 'Modal';
        this.content = options.content || '';
        this.buttons = options.buttons || [
            { text: 'Close', type: 'secondary', id: 'close', handler: () => this.close() }
        ];
        this.onOpen = options.onOpen || (() => {});
        this.onClose = options.onClose || (() => {});
        this.element = null;
        this.overlay = null;
        this.isCreated = false;
        
        // Create the modal if it doesn't exist
        this.create();
        
        // Bind methods to this instance
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
    }
    
    /**
     * Create the modal DOM structure
     */
    create() {
        // Check if modal already exists
        if (this.isCreated) return;
        
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.id = this.id + '-overlay';
        
        // Create modal container
        this.element = document.createElement('div');
        this.element.className = 'modal';
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-labelledby', this.id + '-title');
        this.element.setAttribute('aria-modal', 'true');
        
        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('h2');
        title.className = 'modal-title';
        title.id = this.id + '-title';
        title.textContent = this.title;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.setAttribute('aria-label', 'Close modal');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', this.close);
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else if (this.content instanceof HTMLElement) {
            body.appendChild(this.content);
        }
        
        // Create footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        // Add buttons to footer
        this.buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.className = `modal-button ${button.type}-button`;
            buttonElement.id = button.id || button.text.toLowerCase().replace(/\s+/g, '-');
            buttonElement.textContent = button.text;
            
            if (button.handler) {
                buttonElement.addEventListener('click', button.handler);
            }
            
            footer.appendChild(buttonElement);
        });
        
        // Assemble modal
        this.element.appendChild(header);
        this.element.appendChild(body);
        this.element.appendChild(footer);
        this.overlay.appendChild(this.element);
        
        // Add event listeners
        this.overlay.addEventListener('click', this.handleOverlayClick);
        
        // Append to body
        document.body.appendChild(this.overlay);
        
        this.isCreated = true;
    }
    
    /**
     * Open the modal
     */
    open() {
        if (!this.isCreated) {
            this.create();
        }
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Focus on close button for accessibility
        setTimeout(() => {
            const closeButton = this.element.querySelector('.modal-close');
            if (closeButton) {
                closeButton.focus();
            }
        }, 100);
        
        // Call onOpen callback
        if (typeof this.onOpen === 'function') {
            this.onOpen();
        }
    }
    
    /**
     * Close the modal
     */
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Call onClose callback
        if (typeof this.onClose === 'function') {
            this.onClose();
        }
    }
    
    /**
     * Handle keydown events (close on Escape)
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
    
    /**
     * Handle overlay click (close when clicking outside modal)
     * @param {MouseEvent} event - The mouse event
     */
    handleOverlayClick(event) {
        if (event.target === this.overlay) {
            this.close();
        }
    }
    
    /**
     * Update the modal content
     * @param {Object} options - Options to update
     */
    update(options = {}) {
        // Update properties
        if (options.title) {
            this.title = options.title;
            const titleElement = this.element.querySelector('.modal-title');
            if (titleElement) {
                titleElement.textContent = this.title;
            }
        }
        
        if (options.content) {
            this.content = options.content;
            const bodyElement = this.element.querySelector('.modal-body');
            if (bodyElement) {
                bodyElement.innerHTML = '';
                if (typeof this.content === 'string') {
                    bodyElement.innerHTML = this.content;
                } else if (this.content instanceof HTMLElement) {
                    bodyElement.appendChild(this.content);
                }
            }
        }
        
        if (options.buttons) {
            this.buttons = options.buttons;
            const footerElement = this.element.querySelector('.modal-footer');
            if (footerElement) {
                footerElement.innerHTML = '';
                this.buttons.forEach(button => {
                    const buttonElement = document.createElement('button');
                    buttonElement.className = `modal-button ${button.type}-button`;
                    buttonElement.id = button.id || button.text.toLowerCase().replace(/\s+/g, '-');
                    buttonElement.textContent = button.text;
                    
                    if (button.handler) {
                        buttonElement.addEventListener('click', button.handler);
                    }
                    
                    footerElement.appendChild(buttonElement);
                });
            }
        }
        
        if (options.onOpen) {
            this.onOpen = options.onOpen;
        }
        
        if (options.onClose) {
            this.onClose = options.onClose;
        }
    }
    
    /**
     * Destroy the modal and remove it from the DOM
     */
    destroy() {
        if (this.overlay) {
            this.overlay.removeEventListener('click', this.handleOverlayClick);
            document.removeEventListener('keydown', this.handleKeyDown);
            document.body.removeChild(this.overlay);
            this.isCreated = false;
        }
    }
}
