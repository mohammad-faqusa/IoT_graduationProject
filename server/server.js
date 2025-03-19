const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: path.join(__dirname, '.env')});

require('./database.js')

const socketio = require('socket.io')
const socketMain = require('./socketMain')
const app = require('./app.js')


const port = process.env.PORT;

const expressServer = app.listen(port, ()=> {
    console.log(`the srever is running on http://localhost:${port}`)
})

const io = socketio(expressServer)

socketMain(io); 



