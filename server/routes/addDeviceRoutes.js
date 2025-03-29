const express = require('express')
const addDeviceControllers = require('./../controllers/addDeviceControllers')
const router = express.Router(); 


// Handle GET and POST requests on '/'
router.get('/', addDeviceControllers.getAddDevicePage); // GET request


module.exports = router; 