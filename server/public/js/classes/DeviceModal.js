class DeviceModal extends Modal {
    /**
     * Create a new device modal
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Create content template for device modal
        const content = `
            <div class="modal-image-container">
                <img src="/placeholder.svg" alt="Device" class="modal-image" id="device-modal-image">
            </div>
            <div class="device-details">
                <div class="detail-item">
                    <div class="detail-label">Device ID</div>
                    <div class="detail-value" id="device-modal-id">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Type</div>
                    <div class="detail-value" id="device-modal-type">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value" id="device-modal-location">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value" id="device-modal-status">-</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Last Update</div>
                    <div class="detail-value" id="device-modal-last-update">-</div>
                </div>
            </div>
        `;
        
        // Default buttons for device modal
        const buttons = [
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
                handler: () => this.controlDevice() 
            }
        ];
        
        // Call parent constructor with device-specific options
        super({
            id: 'device-modal',
            title: options.title || 'Device Details',
            content: content,
            buttons: buttons,
            onOpen: options.onOpen,
            onClose: options.onClose
        });
        
        // Device-specific properties
        this.device = null;
    }
    
    /**
     * Show device details in the modal
     * @param {Object} device - The device data to display
     */
    showDevice(device) {
        this.device = device;
        
        // Update modal title
        this.update({ title: device.name });
        
        // Update device details
        const imageElement = document.getElementById('device-modal-image');
        const idElement = document.getElementById('device-modal-id');
        const typeElement = document.getElementById('device-modal-type');
        const locationElement = document.getElementById('device-modal-location');
        const statusElement = document.getElementById('device-modal-status');
        const lastUpdateElement = document.getElementById('device-modal-last-update');
        
        if (imageElement) {
            imageElement.src = device.image;
            imageElement.alt = device.name;
        }
        
        if (idElement) idElement.textContent = device.id;
        if (typeElement) typeElement.textContent = device.type;
        if (locationElement) locationElement.textContent = device.location;
        
        if (statusElement) {
            statusElement.textContent = device.status.charAt(0).toUpperCase() + device.status.slice(1);
            statusElement.style.color = device.status === 'online' ? '#48bb78' : '#f56565';
        }
        
        if (lastUpdateElement) lastUpdateElement.textContent = device.lastUpdate;
        
        // Update control button text based on status
        const controlButton = document.getElementById('device-modal-control');
        if (controlButton) {
            controlButton.textContent = device.status === 'online' ? 'Control Device' : 'Restart Device';
        }
        
        // Open the modal
        this.open();
    }
    
    /**
     * Handle device control action
     */
    controlDevice() {
        if (!this.device) return;
        
        if (this.device.status === 'online') {
            alert(`Opening control panel for ${this.device.name}`);
        } else {
            alert(`Attempting to restart ${this.device.name}...`);
            // Here you would typically make an API call to restart the device
        }
    }
}

