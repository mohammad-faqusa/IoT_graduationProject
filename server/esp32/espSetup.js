
const path = require('path')

const { exec } = require('child_process');
const generateFiles = require(path.join(__dirname, 'generateFiles'))



function espSetup(id, plist, socket) {
  socket.emit('processSetup', {status: 'processing', data: 'generating files'} )

  generateFiles(id, plist);
  
  exec(`mpremote soft-reset`, (error, stdout, stderr) => {
    socket.emit('processSetup', {status: 'processing', data: 'soft resetting the esp32'} )

    if (error) {
      console.error(`Error: ${error.message}`);
      socket.emit('errorSetup', {status: 'processing', data: `Error: ${error.message}` } )
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      socket.emit('errorSetup', `Stderr: ${stderr}` )

      return;
    }
    socket.emit('processSetup', {status: 'processing', data: 'finished soft resetting'} )
    socket.emit('processSetup', {status: 'processing', data: 'installing libraries...'} )
    exec(`mpremote mip install github:peterhinch/micropython-mqtt`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        socket.emit('errorSetup', `Error: ${error.message}` )

        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        socket.emit('errorSetup', `Stderr: ${stderr}` )

        return;
      }
      socket.emit('processSetup', {status: 'processing', data: 'finished installing libraries.'} )
      socket.emit('processSetup', {status: 'processing', data: 'copying the files to esp32...'} )
      exec(`mpremote connect COM3 fs cp ${__dirname}/espFiles/main.py :main.py`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          socket.emit('errorSetup', `Error: ${error.message}` )
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          socket.emit('errorSetup', `Stderr: ${stderr}` )
          return;
        }
    
        exec(`mpremote connect COM3 fs cp ${__dirname}/espFiles/boot.py :boot.py`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            socket.emit('errorSetup', `Error: ${error.message}` )
            return;
          }
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
            socket.emit('errorSetup', `Stderr: ${stderr}` )

            return;
          }
          socket.emit('processSetup', {status: 'finished', data: 'the setup is done successfully!'} )
        });
        
      });
    })
    
  })
  

}

module.exports = espSetup