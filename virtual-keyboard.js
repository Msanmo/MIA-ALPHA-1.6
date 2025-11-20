// ========================================
// TECLADO VIRTUAL TÁCTIL PARA PANTALLAS TOUCH
// Multiidioma: ES, EN, FR, DE, IT, SV
// ========================================

class VirtualKeyboard {
    constructor() {
        this.layouts = {
            es: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
                ['z', 'x', 'c', 'v', 'b', 'n', 'm', '¿', '?', '!'],
                ['SPACE', 'BACKSPACE', 'ENTER']
            ],
            en: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                ['z', 'x', 'c', 'v', 'b', 'n', 'm', '?', '!'],
                ['SPACE', 'BACKSPACE', 'ENTER']
            ],
            fr: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
                ['w', 'x', 'c', 'v', 'b', 'n', 'é', 'è', 'à', 'ç'],
                ['SPACE', 'BACKSPACE', 'ENTER']
            ],
            de: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
                ['y', 'x', 'c', 'v', 'b', 'n', 'm', 'ß', '?', '!'],
                ['SPACE', 'BACKSPACE', 'ENTER']
            ],
            it: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'à', 'ò'],
                ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'è', 'ù', 'ì'],
                ['SPACE', 'BACKSPACE', 'ENTER']
            ],
            sv: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
                ['z', 'x', 'c', 'v', 'b', 'n', 'm', '?', '!'],
                ['SPACE', 'BACKSPACE', 'ENTER']
            ]
        };
        
        this.currentLanguage = 'es';
        this.inputField = null;
        this.isShiftActive = false;
        this.keyboardElement = null;
    }

    create(language = 'es') {
        this.currentLanguage = language;
        
        // Crear contenedor del teclado
        const keyboardContainer = document.createElement('div');
        keyboardContainer.className = 'virtual-keyboard';
        keyboardContainer.id = 'virtualKeyboard';
        
        // Obtener layout del idioma
        const layout = this.layouts[language] || this.layouts.es;
        
        // Crear filas de teclas
        layout.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyButton = document.createElement('button');
                keyButton.className = 'keyboard-key';
                
                // Teclas especiales
                if (key === 'SPACE') {
                    keyButton.className += ' key-space';
                    keyButton.textContent = 'Espacio';
                    keyButton.dataset.key = ' ';
                } else if (key === 'BACKSPACE') {
                    keyButton.className += ' key-backspace';
                    keyButton.textContent = '⌫';
                    keyButton.dataset.key = 'BACKSPACE';
                } else if (key === 'ENTER') {
                    keyButton.className += ' key-enter';
                    keyButton.textContent = '↵';
                    keyButton.dataset.key = 'ENTER';
                } else {
                    keyButton.textContent = key;
                    keyButton.dataset.key = key;
                }
                
                // Event listener para touch/click
                keyButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleKeyPress(key);
                });
                
                rowElement.appendChild(keyButton);
            });
            
            keyboardContainer.appendChild(rowElement);
        });
        
        this.keyboardElement = keyboardContainer;
        return keyboardContainer;
    }

    handleKeyPress(key) {
        if (!this.inputField) return;
        
        const currentValue = this.inputField.value;
        
        if (key === 'BACKSPACE') {
            this.inputField.value = currentValue.slice(0, -1);
        } else if (key === 'ENTER') {
            // Trigger enter event
            const event = new KeyboardEvent('keypress', { key: 'Enter' });
            this.inputField.dispatchEvent(event);
        } else if (key === 'SPACE') {
            this.inputField.value = currentValue + ' ';
        } else {
            const char = this.isShiftActive ? key.toUpperCase() : key;
            this.inputField.value = currentValue + char;
        }
        
        // Trigger input event para que otros listeners se activen
        this.inputField.dispatchEvent(new Event('input'));
        
        // Mantener focus visual
        this.inputField.focus();
    }

    attachTo(inputElement) {
        this.inputField = inputElement;
    }

    show() {
        if (this.keyboardElement) {
            this.keyboardElement.style.display = 'flex';
        }
    }

    hide() {
        if (this.keyboardElement) {
            this.keyboardElement.style.display = 'none';
        }
    }

    destroy() {
        if (this.keyboardElement && this.keyboardElement.parentNode) {
            this.keyboardElement.parentNode.removeChild(this.keyboardElement);
        }
        this.keyboardElement = null;
        this.inputField = null;
    }
}

// Export para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtualKeyboard;
}
