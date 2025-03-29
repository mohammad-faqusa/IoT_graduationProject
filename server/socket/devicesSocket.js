const {getDevices} = require('./../data/devices')

const mqtt = require('mqtt');


const displayDevicesSocket = async (socket) => {

    let selectedDeviceId; 
    let onlineStatusInterval = {};
    let onlineDevices = []
    let statusLog = []; 

    let devices = await getDevices(); 

    devices.forEach(device => device.dictList = Object.entries(device.dictVariables).map(([key, val]) => key))
    
    const client = mqtt.connect('mqtt:localhost');

    client.on('connect', ()=> console.log('connected to the broker'))
    client.subscribe('esp32/result');
    client.subscribe('esp32/status');
    client.on('message', (topic, message) => {
        if (topic === 'esp32/result'){
            const deviceId = JSON.parse(message).id;
            try{
                const device = devices.find(device => device.id === deviceId )
                device.dictVariables = JSON.parse(message)
            } catch(err) {
                console.log('dict varaibles of device with id: ', deviceId, ' is not defined')
            }
        }
        if (topic === 'esp32/status')
            statusLog.push(message.toString()*1)       
    }) 

    socket.on('fetchDevices', (data, ackCallBack) => {
        ackCallBack(devices)
        if(data === 'all') {
            onlineStatusInterval = setInterval(() => {
                onlineDevices = [...new Set(statusLog)]
                statusLog = [];
                devices.forEach(device => device.status = onlineDevices.includes(device.id) ? 'online' : 'offline')
                socket.emit('onlineDevices', onlineDevices)
            }, 3000);
        }
    })

    socket.on('deviceClick', async (data, ackCallBack) => {
        selectedDeviceId = data * 1  ;
        const  device = devices.find(device => device.id === data * 1)
        
        client.publish(`esp32/${device.id}/getDict`, '')
        ackCallBack(device)

    })

    socket.on('disconnect', ()=> {
        clearInterval(onlineStatusInterval)
    })
}

module.exports = displayDevicesSocket