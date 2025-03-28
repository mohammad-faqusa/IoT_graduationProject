
const { exec } = require('child_process');
const generateFiles = require('./generateFiles')



function espSetup(id, plist, socket) {
  generateFiles(id, plist); 
  exec('mpremote connect COM3 fs cp ./espFiles/main.py :main.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      socket.emit('errorMessage',`Error: ${error.message}` )
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      socket.emit('errorMessage',stderr )
      return;
    }
    console.log(`Stdout: ${stdout}`);

    exec('mpremote connect COM3 fs cp ./espFiles/boot.py :boot.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        socket.emit('errorMessage',`Error: ${error.message}` )
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        socket.emit('errorMessage',`Stderr: ${stderr}` )
        return;
      }
      console.log(`Stdout: ${stdout}`);
    });
    
  });

}

module.exports = espSetup