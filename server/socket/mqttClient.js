const mqtt = require('mqtt')

const client = mqtt.connect('mqtt:localhost');

client.on('connect', ()=> console.log('mqttClient is connected to the broker'))

client.subscribe('esp32/1/getSub/req')
client.subscribe('esp32/2/getSub/req')

client.on('message', (topic, message)=> {

    const topicArr = topic.split('/')
    const messageObj = JSON.parse(message)
    console.log('received topic : ', topic)
    console.log('received message : ', messageObj)

    if(topicArr[1] * 1  === 1){
        Object.keys(messageObj).forEach((key) => {
            messageObj[key] = Math.floor(Math.random() * 100 * 100) / 100
        })
        console.log(messageObj)
        client.publish('esp32/1/getSub/res', JSON.stringify(messageObj))

    } else if (topicArr[1] * 1 === 2) {
        Object.keys(messageObj).forEach((key) => {
            messageObj[key] = Math.floor(Math.random() * 100 * 100) / 100
        })
        console.log(messageObj)
        client.publish('esp32/2/getSub/res', JSON.stringify(messageObj))
    }
    
})
