const Device = require('../models/Device')
const {getDevices} = require('./../data/devices')

const mqtt = require('mqtt');
// brokerConnectStatus

const dashboardVariables = {}; 

dashboardSocket =  async (socket) => {
    let devices = await getDevices();
    const client = mqtt.connect('mqtt:localhost');
    client.on('connect', ()=> console.log('connected to the broker'))

    client.on("message", (topic, message) => {
        // message is Buffer

        const varPath = topic.split('/').slice(1,-1).join('/')
        console.log(varPath); 
        console.log(message); 
        dashboardVariables[varPath] = message.toString()
        
        // client.end();
      });
    
    socket.on('brokerStatus', (data, ackCallBack) => {
        ackCallBack(client.connected);

    })
    
    socket.on('dashboardCardReq', (data) => {
        // console.log(data);
        console.log('this is the form : ', data.form)
        const device = devices.find(device => data.form.device === device.name);
        const variablePath = `${device.name}/${data.form.source}`
        if(!dashboardVariables[variablePath]) {
            dashboardVariables[variablePath] = ''
            client.subscribe(`esp32/${variablePath}/res`)
        }
        // publish 
        client.publish(`esp32/${variablePath}/req`, `server published ${variablePath}`)
 
        // console.log('this is the selected device : ', device)
        const temp = Math.floor((Math.random() * 100) * 100)/100; 
        socket.emit('dashboardCardRes', {id: data.id, data: dashboardVariables[variablePath]})

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