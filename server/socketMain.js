
const {getDevices} = require('./data/devices')



const socketMain = async (io) => {
    const devices = await getDevices(); 
    console.log(devices); 
    
    io.on('connection', socket => {
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
            console.log('this is the index of device ',data);
            ackCallBack(devices[data].info)
        })
    })
}

module.exports = socketMain