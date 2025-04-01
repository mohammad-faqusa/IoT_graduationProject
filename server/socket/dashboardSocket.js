const Device = require('../models/Device')
const {getDevices} = require('./../data/devices')

const mqtt = require('mqtt');
// brokerConnectStatus

dashboardSocket =  async (socket) => {
    let devices = await getDevices(); 
    const client = mqtt.connect('mqtt:localhost');
    client.on('connect', ()=> console.log('connected to the broker'))

    
    socket.on('brokerStatus', (data, ackCallBack) => {
        ackCallBack(client.connected); 
    })
    
    socket.on('dashboardCardReq', (data) => {
        // console.log(data);
        // console.log('this is the form : ', data.from)
        const device = devices.find(device => data.form.device === device.name); 
        // console.log('this is the selected device : ', device)
        const temp = Math.floor((Math.random() * 100) * 100)/100; 
        socket.emit('dashboardCardRes', {id: data.id, data: temp})
    })

    socket.on('fetchDevices', (data, ackCallBack) => {
        ackCallBack(devices)
        
        // if(data === 'all') {
        //     onlineStatusInterval = setInterval(() => {
        //         onlineDevices = [...new Set(statusLog)]
        //         statusLog = [];
        //         devices.forEach(device => device.status = onlineDevices.includes(device.id) ? 'online' : 'offline')
        //         socket.emit('onlineDevices', onlineDevices)
        //     }, 3000);
        // }
    })

}

module.exports = dashboardSocket; 