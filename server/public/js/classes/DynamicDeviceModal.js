
class DynamicDeviceModal extends Modal {
    constructor(options = {}) {
        const buttons = [
            // modal-close
            { 
                text: 'Close', 
                type: 'secondary', 
                id: 'device-modal-close', 
                handler: () => this.close() 
            },
            { 
                text: 'Control Device', 
                type: 'primary', 
                id: 'device-modal-control', 
        
                type: 'primary',
                id: 'device-modal-control',
                handler: () => this.controlDevice()
            },
            { 
                text: 'x', 
                id:'header-device-modal-close',
                handler: () => this.close()
            }
        ];
        
        super({
            id: 'dynamic-device-modal',
            title: options.title || 'Device Details',
            content: '<div id="dynamic-device-content"></div>',
            buttons: buttons,
            onOpen: options.onOpen,
            onClose: options.onClose
        });
        
        this.device = null;
    }
    
    showDevice(deviceData) {
        this.device = deviceData;
        
        this.update({ title: deviceData.name || 'Device Details' });
        
        const contentContainer = document.createElement('div');
        
        for (const [key, value] of Object.entries(deviceData)) {
            const fieldElement = this.renderField(key, value);
            if (fieldElement) {
                contentContainer.appendChild(fieldElement);
            }
        }
        
        this.setContent(contentContainer);
        
        const controlButton = document.getElementById('device-modal-control');
        if (controlButton) {
            controlButton.textContent = deviceData.status === 'online' ? 'Control Device' : 'Restart Device';
        }
        
        this.open();
    }
    
    renderField(key, value) {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'field-item';
        
        const label = document.createElement('div');
        label.className = 'field-label';
        label.textContent = this.formatLabel(key);
        
        const valueElement = document.createElement('div');
        valueElement.className = 'field-value';
        
        if (key === 'image' && typeof value === 'string') {
            const img = document.createElement('img');
            img.src = value;
            img.alt = 'Device image';
            img.className = 'field-image';
            fieldElement.appendChild(img);
        } else if (key === 'status') {
            const statusIndicator = document.createElement('span');
            statusIndicator.className = `status-indicator status-${value.toLowerCase()}`;
            
            const statusText = document.createElement('span');
            statusText.textContent = value;
            statusText.className = `status-text status-${value.toLowerCase()}-text`;
            
            valueElement.appendChild(statusIndicator);
            valueElement.appendChild(statusText);
        } else {
            valueElement.textContent = value;
        }
        
        if (key !== 'image') {
            fieldElement.appendChild(label);
            fieldElement.appendChild(valueElement);
        }
        
        return fieldElement;
    }
    
    formatLabel(key) {
        return key.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
    
    controlDevice() {
        if (!this.device) return;
        
        if (this.device.status === 'online') {
            alert(`Opening control panel for ${this.device.name}`);
        } else {
            alert(`Attempting to restart ${this.device.name}...`);
        }
    }
}
