
const path = require('path')

const { exec } = require('child_process');
const generateFiles = require(path.join(__dirname, 'generateFiles'))



function espSetup(id, plist, socket) {
  generateFiles(id, plist);
  
  exec(`mpremote soft-reset`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      socket.emit('errorEspSetup', `Error: ${error.message}` )
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      socket.emit('errorEspSetup', `Stderr: ${stderr}` )

      return;
    }
    console.log(`Stdout: ${stdout}`);
    socket.emit('espSetupProcess', `Stdout: ${stdout}` )
    exec(`mpremote mip install github:peterhinch/micropython-mqtt`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        socket.emit('errorEspSetup', `Error: ${error.message}` )

        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        socket.emit('errorEspSetup', `Stderr: ${stderr}` )

        return;
      }
      console.log(`Stdout: ${stdout}`);
      socket.emit('espSetupProcess', `Stdout: ${stdout}` )
      exec(`mpremote connect COM3 fs cp ${__dirname}/espFiles/main.py :main.py`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          socket.emit('errorEspSetup', `Error: ${error.message}` )

          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          socket.emit('errorEspSetup', `Stderr: ${stderr}` )

          return;
        }
        console.log(`Stdout: ${stdout}`);
        socket.emit('espSetupProcess', `Stdout: ${stdout}` )
    
        exec(`mpremote connect COM3 fs cp ${__dirname}/espFiles/boot.py :boot.py`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            socket.emit('errorEspSetup', `Error: ${error.message}` )
            return;
          }
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
            socket.emit('errorEspSetup', `Stderr: ${stderr}` )

            return;
          }
          console.log(`Stdout: ${stdout}`);
          socket.emit('espSetupFinish', `Stdout: ${stdout}, the setup is finished seccessfully` )

        });
        
      });
    })
    
  })
  

}

module.exports = espSetup