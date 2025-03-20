exports.getAllDevices = (req,res) => {
    console.log('here is all devices')
    res.send('here is all devices')

}

exports.addDevice = (req, res) => {
    console.log(req.body); 
    res.send('the devices is added!')
}

