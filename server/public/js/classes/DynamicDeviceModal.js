
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
            onClose: ()=> clearInterval(this.displayInterval),
            onUpdate: ()=> console.log('updated')
        });
        
        this.device = null;
        this.fieldsValues = {}; 
    }
    
    async showDevice(socket, deviceId) {
        this.fieldsValues = {}; 
        this.device = await socket.emitWithAck('deviceClick', deviceId)
        this.update({ title: this.device.name || 'Device Details' });
    
        const contentContainer = document.createElement('div');

        contentContainer.innerHTML = ''; 
            
        for (const [key, value] of Object.entries(this.device)) {
            if(!['__v', 'automatedFunctions', '_id'].includes(key)){
                if(key === 'dictVariables') {
                    for (const [key2, value2] of Object.entries(this.device.dictVariables)) {
                        const fieldElement = this.renderField(key2, value2);
                        if (fieldElement) {
                            contentContainer.appendChild(fieldElement);
                        }
                    }
                } else {
                    const fieldElement = this.renderField(key, value);
                    if (fieldElement) {
                        contentContainer.appendChild(fieldElement);
                    }
                }
            }
        }
        

        this.setContent(contentContainer);
        
        const controlButton = document.getElementById('device-modal-control');
        if (controlButton) {
            controlButton.textContent = this.device.status === 'online' ? 'Control Device' : 'Restart Device';
        }
        
        this.open();

        this.displayInterval = setInterval(async () => {
            this.device = await socket.emitWithAck('deviceClick', deviceId)
            console.log(this.device.status); 
            for (const [key, value] of Object.entries(this.fieldsValues)) {
                const fieldValue = document.getElementById(value); 
                if (this.device[key])
                    fieldValue.textContent = this.device[key].toString()
                else if(this.device.dictVariables[key])
                    fieldValue.textContent = this.device.dictVariables[key].toString()
                else 
                    console.log(key); 
            }
        }, 4000);
        
        
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

            this.fieldsValues[key] = key+'-field-value'
            statusText.id = this.fieldsValues[key]

            statusText.textContent = value;
            statusText.className = `status-text status-${value.toLowerCase()}-text`;
            
            valueElement.appendChild(statusIndicator);
            valueElement.appendChild(statusText);
        } else {
            valueElement.textContent = value.toString();
            this.fieldsValues[key] = key+'-field-value'
            valueElement.id = this.fieldsValues[key]
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
