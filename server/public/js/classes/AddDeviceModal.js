class AddDeviceModal extends Modal {
    constructor(options = {}) {
        const buttons = [
            { 
                text: 'Cancel', 
                type: 'secondary', 
                id: 'add-device-cancel', 
                handler: () => this.close() 
            },
            { 
                text: 'Add Device', 
                type: 'primary', 
                id: 'add-device-submit', 
                handler: () => this.submitForm() 
            },
            { 
                text: 'x', 
                id:'header-device-modal-close',
                handler: () => this.close()
            }
        ];
        
        super({
            id: 'add-device-modal',
            title: 'Add New Device',
            content: '',
            buttons: buttons,
            onOpen: options.onOpen,
            onClose: options.onClose
        });
        
        this.onDeviceAdded = options.onDeviceAdded || (() => {});
        this.createForm();
    }
    
    createForm() {
        const form = document.createElement('form');
        form.id = 'add-device-form';
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
        
        // Device Name
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.className = 'form-label';
        nameLabel.htmlFor = 'device-name';
        nameLabel.textContent = 'Device Name';
        
        const nameInput = document.createElement('input');
        nameInput.className = 'form-input';
        nameInput.type = 'text';
        nameInput.id = 'device-name';
        nameInput.name = 'device-name';
        nameInput.required = true;
        
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        
        // Device Type
        const typeGroup = document.createElement('div');
        typeGroup.className = 'form-group';
        
        const typeLabel = document.createElement('label');
        typeLabel.className = 'form-label';
        typeLabel.htmlFor = 'device-type';
        typeLabel.textContent = 'Device Type';
        
        const typeSelect = document.createElement('select');
        typeSelect.className = 'form-select';
        typeSelect.id = 'device-type';
        typeSelect.name = 'device-type';
        typeSelect.required = true;
        
        const deviceTypes = [
            { value: '', label: 'Select a device type' },
            { value: 'Thermostat', label: 'Thermostat' },
            { value: 'Camera', label: 'Camera' },
            { value: 'Light', label: 'Light' },
            { value: 'Lock', label: 'Smart Lock' },
            { value: 'Speaker', label: 'Smart Speaker' },
            { value: 'Sensor', label: 'Sensor' }
        ];
        
        deviceTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.label;
            typeSelect.appendChild(option);
        });
        
        typeGroup.appendChild(typeLabel);
        typeGroup.appendChild(typeSelect);
        
        // Location
        const locationGroup = document.createElement('div');
        locationGroup.className = 'form-group';
        
        const locationLabel = document.createElement('label');
        locationLabel.className = 'form-label';
        locationLabel.htmlFor = 'device-location';
        locationLabel.textContent = 'Location';
        
        const locationInput = document.createElement('input');
        locationInput.className = 'form-input';
        locationInput.type = 'text';
        locationInput.id = 'device-location';
        locationInput.name = 'device-location';
        locationInput.required = true;
        
        locationGroup.appendChild(locationLabel);
        locationGroup.appendChild(locationInput);
        
        // Status
        const statusGroup = document.createElement('div');
        statusGroup.className = 'form-group';
        
        const statusLabel = document.createElement('label');
        statusLabel.className = 'form-label';
        statusLabel.htmlFor = 'device-status';
        statusLabel.textContent = 'Status';
        
        const statusSelect = document.createElement('select');
        statusSelect.className = 'form-select';
        statusSelect.id = 'device-status';
        statusSelect.name = 'device-status';
        statusSelect.required = true;
        
        const statusOptions = [
            { value: 'online', label: 'Online' },
            { value: 'offline', label: 'Offline' }
        ];
        
        statusOptions.forEach(status => {
            const option = document.createElement('option');
            option.value = status.value;
            option.textContent = status.label;
            statusSelect.appendChild(option);
        });
        
        statusGroup.appendChild(statusLabel);
        statusGroup.appendChild(statusSelect);
        
        // Image URL
        const imageGroup = document.createElement('div');
        imageGroup.className = 'form-group';
        
        const imageLabel = document.createElement('label');
        imageLabel.className = 'form-label';
        imageLabel.htmlFor = 'device-image';
        imageLabel.textContent = 'Image URL';
        
        const imageInput = document.createElement('input');
        imageInput.className = 'form-input';
        imageInput.type = 'url';
        imageInput.id = 'device-image';
        imageInput.name = 'device-image';
        imageInput.placeholder = 'https://example.com/image.jpg';
        
        imageGroup.appendChild(imageLabel);
        imageGroup.appendChild(imageInput);
        
        // Additional Properties
        const propsGroup = document.createElement('div');
        propsGroup.className = 'form-group';
        
        const propsLabel = document.createElement('label');
        propsLabel.className = 'form-label';
        propsLabel.htmlFor = 'device-properties';
        propsLabel.textContent = 'Additional Properties (JSON format)';
        
        const propsInput = document.createElement('textarea');
        propsInput.className = 'form-input';
        propsInput.id = 'device-properties';
        propsInput.name = 'device-properties';
        propsInput.rows = 5;
        propsInput.placeholder = '{\n  "property1": "value1",\n  "property2": "value2"\n}';
        
        propsGroup.appendChild(propsLabel);
        propsGroup.appendChild(propsInput);
        
        // Assemble form
        form.appendChild(nameGroup);
        form.appendChild(typeGroup);
        form.appendChild(locationGroup);
        form.appendChild(statusGroup);
        form.appendChild(imageGroup);
        form.appendChild(propsGroup);
        
        this.setContent(form);
    }
    
    submitForm() {
        const form = document.getElementById('add-device-form');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const name = document.getElementById('device-name').value;
        const type = document.getElementById('device-type').value;
        const location = document.getElementById('device-location').value;
        const status = document.getElementById('device-status').value;
        const image = document.getElementById('device-image').value || 'https://via.placeholder.com/300x200?text=No+Image';
        
        // Generate a unique ID based on type and timestamp
        const id = `${type.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        // Create the base device object
        const newDevice = {
            name,
            id,
            type,
            location,
            status,
            image
        };
        
        // Try to parse additional properties
        try {
            const propsText = document.getElementById('device-properties').value;
            
            if (propsText.trim()) {
                const additionalProps = JSON.parse(propsText);
                Object.assign(newDevice, additionalProps);
            }
        } catch (error) {
            alert('Error parsing additional properties. Please check the JSON format.');
            console.error('Error parsing properties:', error);
            return;
        }
        
        // Call the callback with the new device
        this.onDeviceAdded(newDevice);
        
        // Close the modal
        this.close();
    }
}