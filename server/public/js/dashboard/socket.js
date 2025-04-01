const socket = io('/dashboard'); 

let devices = [] 

let components = {} ; 

socket.on('connect', async ()=> {
    console.log('connected to the server ')
    devices = await socket.emitWithAck('fetchDevices', 'all')
    devices = devices.map(device => new Device(device))
    console.log(devices); 
})

socket.on('dashboardCardRes', data => {
    // console.log(data);

    const outputDisplay = components[data.id].component.querySelector('.'+components[data.id].componentType)
    outputDisplay.textContent = data.data 
})

// socket.on('onlineDevices', onlineDevices => {
//     console.log(onlineDevices)
// })
