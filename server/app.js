const express = require('express');
const path = require('path');

const devicesRouter = require('./routes/devicesRoutes')

const app = express(); 

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.use('/devices', devicesRouter)

app.get('/', (req, res)=> {
    res.send('hello word')
})


module.exports = app; 
