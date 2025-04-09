const { json } = require('express');
const Device = require('../models/Device')
const {getDevices} = require('./../data/devices')

const mqtt = require('mqtt');
// brokerConnectStatus

const dashboardVariables = {};
const devicesCardsRes = {}
const devicesIds = {}
const subscribedDevices = [] 
const componentsIds = {} 

dashboardSocket =  async (socket) => {
    let devices = await getDevices();
    const client = mqtt.connect('mqtt:localhost');
    client.on('connect', ()=> console.log('connected to the broker'))

    client.on("message", (topic, message) => {
        const topicArr = topic.split('/');
        const messageObj = JSON.parse(message)
        console.log(messageObj); 
        
        if(topicArr.at(-1) === 'res'){
            
            if(topicArr.at(-2) === 'getSub'){
                
                const deviceName = devices.find(device => device.id === topicArr.at(-3)*1).name
                devicesCardsRes[deviceName] = {} 
                Object.entries(messageObj).forEach(([pName, pValue]) => {
                    devicesCardsRes[deviceName][pName] = {value: pValue, componentId:componentsIds[deviceName][pName] }
                })
                console.log('this is message object immediate : ', messageObj)
                if(messageObj.sendImmediate){
                    socket.emit('sendImmediate', devicesCardsRes[deviceName])
                }

                
            }
        }
    });
    
    socket.on('brokerStatus', (data, ackCallBack) => {
        ackCallBack(client.connected);

    })
    
    socket.on('devicesCards', (devicesCards, ackCallBack) => {


        Object.entries(devicesCards).forEach(async ([deviceName, peripherals]) => {
            if(!devicesCardsRes[deviceName]){
                devicesCardsRes[deviceName] = {}
                componentsIds[deviceName] = {}
                devicesIds[deviceName] = devices.find(device => device.name === deviceName).id
                client.subscribe(`esp32/${devicesIds[deviceName]}/getSub/res`)
                devicesCardsRes[deviceName] = peripherals         
            }
            const deviceId = devicesIds[deviceName]

            const selectedPDict = {} 
            Object.entries(peripherals).forEach(([pName, pObj]) => {
                selectedPDict[pName] = pObj.sendValue
                componentsIds[deviceName][pName] = pObj.componentId
            })
            client.publish(`esp32/${deviceId}/getSub/req`, JSON.stringify(selectedPDict))
        })

        ackCallBack(devicesCardsRes)
    })

    socket.on('deviceCardControl', (device)=>{
        console.log(device);
        pObj = {} 
        pObj[device.peripheral] = device.value

        const deviceId = devices.find(dev => dev.name === device.device).id


        client.publish(`esp32/${deviceId}/getSub/req`, JSON.stringify(pObj))
    })
 
    socket.on('fetchDevices', (data, ackCallBack) => {
        ackCallBack(devices)
    })

}

module.exports = dashboardSocket; 