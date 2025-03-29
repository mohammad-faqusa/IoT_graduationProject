const deviceSocket = require('./deviceSocket')
const devicesSocket = require('./devicesSocket')

const socketMain = async (io) => {
    io.on('connection', socket => {
        console.log(`a socket with id:${socket.id} is connected to the server`)

        deviceSocket(socket); 
        devicesSocket(socket); 
    })
}

module.exports = socketMain