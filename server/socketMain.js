
const {getDevices} = require('./data/devices')

const mqtt = require('mqtt');

const socketMain = async (io) => {
    
    
    io.on('connection', async socket => {
          
        let currentDeviceIndex; 
        const devices = await getDevices(); 
        
        devices.forEach(device => device.dictList = Object.entries(device.dictVariables).map(([key, val]) => key))
        
        const client = mqtt.connect('mqtt:localhost');

        client.on('connect', ()=> console.log('connected to the broker'))
        client.subscribe('esp32/result');
        client.on('message', (topic, message) => {
            if(currentDeviceIndex)
                devices[currentDeviceIndex].dictVariables = JSON.parse(message)
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
            if(data === 'all') {
                ackCallBack(devices)
            }
        })

        socket.on('deviceClick', (data, ackCallBack) => {
            currentDeviceIndex = data * 1 ; 
            ackCallBack(devices[data])
        })
    })
}



module.exports = socketMain