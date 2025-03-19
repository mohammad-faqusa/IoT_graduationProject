
const socket = io(); 

socket.on('connect', async ()=> {
    console.log('connected to the server')

    const devices = (await socket.emitWithAck('fetchDevices', 'all')).map(device => device.info)
    // const devices3 = devices2.map()
    
    // Create device cards
    renderCards(devices)
    
    openOnClick(devices, socket); 

    addDeviceFunc(); 
})



function renderCards(devices){
    const deviceGrid = document.querySelector('.device-grid');
    deviceGrid.innerHTML = ''; 
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
}

function openOnClick(devices, socket) {
    // Create a single instance of DynamicDeviceModal
    const deviceModal = new DynamicDeviceModal();
    
    // Add click event to each device card
    const deviceCards = document.querySelectorAll('.device-card');
    deviceCards.forEach((card, index) => {
        card.addEventListener('click', async () => {
            const deviceData = await socket.emitWithAck('deviceClick', index)
            console.log(deviceData); 
            deviceModal.showDevice(deviceData);
        });
    });
}

function addDeviceFunc() {
    // Create an instance of AddDeviceModal
    const addDeviceModal = new AddDeviceModal({
        onDeviceAdded: (newDevice) => {
            // Add the new device to the devices array
            devices.push(newDevice);
            
            // Re-render the device cards
            renderDeviceCards();
            
            // Show a success message
            alert(`Device "${newDevice.name}" has been added successfully!`);
        }
    });
    
    // Add click event to the Add Device button
    document.getElementById('add-device-button').addEventListener('click', () => {
        addDeviceModal.open();
    });
}