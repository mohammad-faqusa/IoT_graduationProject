const path = require('path')

exports.getAddDevicePage = async (req, res) => {

    res.sendFile(path.resolve('public/addDevice.html'))

}
