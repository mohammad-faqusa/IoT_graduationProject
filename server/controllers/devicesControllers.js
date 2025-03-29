const path = require('path')

exports.getAllDevices = (req,res) => {
    res.sendFile(path.join(__dirname, './../public/devices.html'))
}


