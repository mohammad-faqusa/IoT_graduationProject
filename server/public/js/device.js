
const socket = io(); 

let devices = []; 
socket.on('connect', async()=> {
    console.log('the client is connected to the server')

    devices = await socket.emitWithAck('fetchDevices', 'all')
    console.log(devices); 
    
    const devicesContainer = document.querySelector('.device-grid'); 
    devices.forEach(device => {
        devicesContainer.innerHTML += getCardTemplate(device); 
    })

    const deviceModal = new DeviceModal();

    // Add click event to each device card
    const deviceCards = document.querySelectorAll('.device-card');
    deviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get data from card
            const deviceData = {
                id: card.getAttribute('data-id'),
                name: card.getAttribute('data-name'),
                status: card.getAttribute('data-status'),
                image: card.getAttribute('data-image'),
                type: card.getAttribute('data-type'),
                location: card.getAttribute('data-location'),
                lastUpdate: card.getAttribute('data-last-update')
            };
            
            // Show device in modal
            deviceModal.showDevice(deviceData);
        });
    });

})

            

function getCardTemplate(device) {
    return `
    <div class="device-card" data-id="TH-2023-001" data-name="${device.name}" data-status="${device.status}" data-image="${device.image}" data-type="Thermostat" data-location="Living Room" data-last-update="2023-10-15 14:32">
        <img src="${device.image}" alt="${device.name}" class="device-image">
        <div class="device-info">
            <h2 class="device-name">${device.name}</h2>
            <p class="device-id">ID: TH-2023-001</p>
            <div class="device-status">
                <span class="status-indicator status-${device.status}"></span>
                <span class="status-text status-${device.status}-text">${device.status}</span>
            </div>
        </div>
    </div>`
}



