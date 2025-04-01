const express = require('express')
const {displayDashboard} = require('./../controllers/dashboard')

const router = express.Router(); 


// Handle GET and POST requests on '/'
router.get('/', displayDashboard); // GET request


module.exports = router; 