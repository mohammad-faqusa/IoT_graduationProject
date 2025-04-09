const { exec } = require("child_process");
const util = require("util");
const generateFiles = require('./generateFiles')

const execPromise = util.promisify(exec);

async function espSetup (id, plist, socket)  {
  try {
    socket.emit('processSetup', {status: 'processing', data: `generating files...`} )
    generateFiles(id, plist);
    socket.emit('processSetup', {status: 'processing', data: `finished generating files`} )


    socket.emit('processSetup', {status: 'processing', data: `soft reset the esp32...`} )
    const { stdout, stderr } = await execPromise('mpremote soft-reset');
    console.log("Output:", stdout);
    if (stderr)
        socket.emit('processSetup', {status: 'processing', data: `Error Output:, ${stderr}`} )
    socket.emit('processSetup', {status: 'processing', data: `finished soft reset`} )
    
    socket.emit('processSetup', {status: 'processing', data: `installing libraries...`} )
    const { stdout2, stderr2 } = await execPromise("mpremote mip install github:peterhinch/micropython-mqtt");
    console.log("Output:", stdout2);
    if (stderr2) 
        socket.emit('processSetup', {status: 'processing', data: `Error Output:, ${stderr2}`} )
    
    socket.emit('processSetup', {status: 'processing', data: `finished installing the libraries.`} )
    const { stdout3, stderr3 } = await execPromise(`mpremote connect COM3 fs cp ${__dirname}/espFiles/main.py :main.py`);
    console.log("Output:", stdout3);
    if (stderr3)
        socket.emit('processSetup', {status: 'processing', data: `Error Output:, ${stderr3}`} )
    socket.emit('processSetup', {status: 'processing', data: `copied main file`} )
    
    const { stdout4, stderr4 } = await execPromise(`mpremote connect COM3 fs cp ${__dirname}/espFiles/boot.py :boot.py`);
    console.log("Output:", stdout4);
    if (stderr4) 
        socket.emit('processSetup', {status: 'processing', data: `Error Output:, ${stderr4}`} )
    socket.emit('processSetup', {status: 'processing', data: `copied boot file`} )

    setTimeout(async () => {
        const { stdout5, stderr5 } = await execPromise('mpremote reset');
        console.log("Output:", stdout5);
        if (stderr5)
            socket.emit('processSetup', {status: 'processing', data: `Error Output:, ${stderr5}`})
    }, 2000);
    

    socket.emit('processSetup', {status: 'finished', data: 'the setup is done successfully!'} )

  } catch (error) {
    console.error("Execution Error:", error);
  }
}

module.exports = espSetup