
const Device = require('./../models/Device')
const espSetup = require('./../esp32/espSetup')


const addDeviceSocket =  (socket) => {
    
    socket.on('addDevice', async data => {

        try{
            
            const peripherals = {}; 
            
            data.peripherals.forEach(p => {
                peripherals[p] = `value of ${p}`
            })
            
            const device = new Device({
                name: data.name,
                location: data.location,
                dictVariables: peripherals
            })

            
            await device.save();
                
            espSetup(device.id, data.peripherals, socket)

        } catch(err) {
            socket.emit('error', err.message)
            console.log(err); 
        }
    })
}

module.exports = addDeviceSocket