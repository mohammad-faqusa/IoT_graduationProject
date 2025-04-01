const express = require('express');
const path = require('path');

const devicesRouter = require('./routes/devicesRoutes')
const addDeviceRouter = require('./routes/addDeviceRoutes')
const dashboardRouter = require('./routes/dashboard')

const app = express(); 

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.use('/devices', devicesRouter)
app.use('/addDevice', addDeviceRouter)
app.use('/dashboard', dashboardRouter)


module.exports = app; 
