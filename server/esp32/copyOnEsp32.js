const { exec } = require('child_process');
const writeFiles = require('./templates')



function espSetup(id) {
  writeFiles(id); 
  exec('mpremote connect COM3 fs cp main.py :main.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);

    exec('mpremote connect COM3 fs cp boot.py :boot.py', (error, stdout, stderr) => {
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

espSetup(10); 