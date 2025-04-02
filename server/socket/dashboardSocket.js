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
        dashboardVariables[varPath].data = message.toString()
        dashboardVariables[varPath].received = true; 
        // client.end();
      });
    
    socket.on('brokerStatus', (data, ackCallBack) => {
        ackCallBack(client.connected);

    })
    
    socket.on('dashboardCardReq', (data, ackCallBack) => {
        // console.log(data);
        console.log(data)
     
        const device = devices.find(device => data.form.device === device.name);
        const variablePath = `${device.id}/${data.form.source}`
        if(!dashboardVariables[variablePath]) {
            dashboardVariables[variablePath] = {}
            client.subscribe(`esp32/${variablePath}/res`)
            dashboardVariables[variablePath].received = true; 
        }
        // publish 
        if(dashboardVariables[variablePath].received){
            client.publish(`esp32/${variablePath}/req`, `server published ${variablePath}`)
            dashboardVariables[variablePath].received = false
        }
 
        ackCallBack({id: data.id, data: dashboardVariables[variablePath].data})

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