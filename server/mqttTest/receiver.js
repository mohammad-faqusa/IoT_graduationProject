const mqtt = require('mqtt')


let arr = [] ;
let connectedDevices = []; 

const client = mqtt.connect('mqtt:localhost');

client.subscribe('esp32/status');


client.on('message', (topic, message) => {
    console.log(message.toString());
    const deviceId = message.toString() * 1 ; 
    arr.push(deviceId)       
})

setInterval(() => {
    arr = new Set(arr)
    connectedDevices = [...arr]; 
    arr = []; 
    console.log(connectedDevices)
}, 12000);