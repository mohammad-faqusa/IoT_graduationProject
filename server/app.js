const express = require('express');
const path = require('path');

const app = express(); 

app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res)=> {
    res.send('hello word')
})

app.get('/devices', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public/devices.html'))
})

module.exports = app; 
