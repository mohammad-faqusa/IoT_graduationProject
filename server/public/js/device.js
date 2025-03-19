
const socket = io(); 

socket.on('connect', async ()=> {
    console.log('connected to the server')
    const devices2 = await socket.emitWithAck('fetchDevices', 'all')
    // const devices3 = devices2.map()
    
    // Sample device data
    const devices = [
        {
            name: "Smart Thermostat",
            id: "TH-2023-001",
            type: "Thermostat",
            status: "online",
            image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            location: "Living Room",
            temperature: "72°F",
            humidity: "45%",
            mode: "Cooling",
            targetTemperature: "70°F"
        },
        {
            name: "Security Camera",
            id: "SC-2023-042",
            type: "Camera",
            status: "offline",
            image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            location: "Front Door",
            resolution: "1080p",
            nightVision: "Enabled",
            motionDetection: "Active"
        },
        {
            name: "Smart Light",
            id: "SL-2023-107",
            type: "Light",
            status: "online",
            image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            location: "Bedroom",
            brightness: "80%",
            color: "Warm White",
            powerUsage: "8.5W"
        },
        ...devices2.map(dev => dev.info)
    ];
    
    // Create device cards
    const deviceGrid = document.querySelector('.device-grid');
    devices.forEach(device => {
        const card = document.createElement('div');
        card.className = 'device-card';
        card.innerHTML = `
            <img src="${device.image}" alt="${device.name}" class="device-image">
            <div class="device-info">
                <h2 class="device-name">${device.name}</h2>
                <p class="device-id">ID: ${device.id}</p>
                <div class="device-status">
                    <span class="status-indicator status-${device.status}"></span>
                    <span class="status-text status-${device.status}-text">${device.status}</span>
                </div>
            </div>
        `;
        deviceGrid.appendChild(card);
    });
    
    // Create a single instance of DynamicDeviceModal
    const deviceModal = new DynamicDeviceModal();
    
    // Add click event to each device card
    const deviceCards = document.querySelectorAll('.device-card');
    deviceCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            deviceModal.showDevice(devices[index]);
        });
    });
})


