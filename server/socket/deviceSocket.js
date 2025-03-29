
const Device = require('../models/Device')
const espSetup = require('../esp32/espSetup2')


deviceSocket =  (socket) => {
    
    socket.on('addDevice', async (data, ackCallBack) => {
        try{
            const peripherals = {}; 
            data.peripherals.forEach(p => {
                peripherals[p] = `value of ${p}`
            })
            console.log(data.picture)
            console.log(data.pictureName)
            const doc = new Device({
                name: data.name,
                location: data.location,
                dictVariables: peripherals
            })
            const device = await doc.save();
            ackCallBack(device.id)
        }catch(err){
            socket.emit('errorSetup', err.message)
            console.log(err); 
        }
    })

    socket.on('setupDevice', async deviceId => {
        const device = await Device.findOne({id: deviceId})
        console.log('this is device : ', device);
        try{
            const pList = Array.from(device.dictVariables.keys());
            console.log('this is pList : ', pList)
            await espSetup(deviceId, pList, socket)
        } catch(err) {
            socket.emit('errorSetup', `error in device setup, ${err.message}`)
            await Device.findByIdAndDelete(device._id)
            socket.emit('processSetup', {status: 'finished', data: 'the device is deleted from the database'})
        }
        
    })

    socket.on('deleteDevice', async (deviceId, ackCallBack) => {
        try {
            const device = await Device.findOneAndDelete({id: deviceId})
            
            ackCallBack(`the device: ${device._id} is deleted successfully`) 
        }catch(err) {
            console.log(err)
            ackCallBack(`error in deleting the device, ${err.message}`) 
        }
    })

}



module.exports = deviceSocket 

