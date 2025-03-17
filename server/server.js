const express = require('express'); 
const dotenv = require('dotenv')
const path = require('path')
const socketio = require('socket.io')

dotenv.config({path: path.join(__dirname, '.env')});

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug');

app.get('/', (req, res)=> {
    res.render('index')
})


const expressServer = app.listen(port, ()=> {
    console.log(`the srever is running on http://localhost:${port}`)
})

const io = socketio(expressServer)

io.on('connection', socket => {
    console.log(`a client is connected with socket:id ${socket.id}`)
    socket.on('message', data => {
        console.log(`client ${socket.id} : ${data}`)
        socket.emit('message', 'hello from the server')
    })
})



