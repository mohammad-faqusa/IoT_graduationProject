const socketMain = (io) => {
    io.on('connection', socket => {
        console.log(`a client is connected with socket:id ${socket.id}`)
        socket.on('message', data => {
            console.log(`client ${socket.id} : ${data}`)
            socket.emit('message', 'hello from the server')
        })

        socket.on('mqttMessage', data => {
            console.log(data); 
        })
    })
}

module.exports = socketMain