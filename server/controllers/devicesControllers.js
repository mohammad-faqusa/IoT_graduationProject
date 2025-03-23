const path = require('path')

const Device = require('./../models/Device')

exports.getAllDevices = (req,res) => {
    res.sendFile(path.join(__dirname, './../public/devices.html'))
}

exports.addDevice = async (req, res) => {
    const peripherals = {}; 

    req.body.peripherals.forEach(p => {
        peripherals[p] = `value of ${p}`
    })

    const device = new Device({
        name: req.body.name,
        location: req.body.location,
        dictVariables: peripherals,
    })

    await device.save(); 

    

    res.status(201).send('the davice is saved')
}
