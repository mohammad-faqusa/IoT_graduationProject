
const { exec } = require('child_process');
const generateFiles = require('./generateFiles')



function espSetup(id, plist) {
  generateFiles(id, plist); 
  exec('mpremote connect COM3 fs cp ./espFiles/main.py :main.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);

    exec('mpremote connect COM3 fs cp ./espFiles/boot.py :boot.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
    });
    
  });

}

module.exports = espSetup