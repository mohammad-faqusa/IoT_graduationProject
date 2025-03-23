
const {getDevices} = require('./data/devices')

const mqtt = require('mqtt');

const socketMain = async (io) => {
    
    io.on('connection', async socket => {
        
        let selectedDeviceId; 
        let onlineStatusInterval = {};
        let onlineDevices = []
        let statusLog = []; 

        const devices = await getDevices(); 
         
        devices.forEach(device => device.dictList = Object.entries(device.dictVariables).map(([key, val]) => key))
        
        const client = mqtt.connect('mqtt:localhost');

        client.on('connect', ()=> console.log('connected to the broker'))
        client.subscribe('esp32/result');
        client.subscribe('esp32/status');



        client.on('message', (topic, message) => {
            if (topic === 'esp32/result'){
                const device = devices.find(device => device.id === selectedDeviceId )
                device.dictVariables = JSON.parse(message)

            }
            if (topic === 'esp32/status')
                statusLog.push(message.toString()*1)       
        }) 

        console.log(`a client is connected with socket:id ${socket.id}`)
        socket.on('message', data => {
            console.log(`client ${socket.id} : ${data}`)
            socket.emit('message', 'hello from the server')
        })

        socket.on('mqttMessage', data => {
            console.log(data); 
        })

        socket.on('greeting', data => {
            console.log(data); 
        })

        socket.on('fetchDevices', (data, ackCallBack) => {
            
            ackCallBack(devices)
            if(data === 'all') {
                onlineStatusInterval = setInterval(() => {
                    onlineDevices = [...new Set(statusLog)]
                    statusLog = [];
                    devices.forEach(device => device.status = onlineDevices.includes(device.id) ? 'online' : 'offline')
                    socket.emit('onlineDevices', onlineDevices)
                }, 12000);
            }
        })

        socket.on('deviceClick', (data, ackCallBack) => {
            selectedDeviceId = data * 1  ;
            const device = devices.find(device => device.id === data * 1)
            client.publish(`esp32/${device.id}/getDict`, '')
            ackCallBack(device)
            console.log(device.status); 

        })

        socket.on('disconnect', ()=> {
            clearInterval(onlineStatusInterval)
        })
    })
}



module.exports = socketMain