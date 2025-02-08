const { spawn } = require('child_process');

// Define the path to the PowerShell script and the COM port
const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/hello.ps1';
const comPort = 'COM3'; // Replace with your desired COM port

// Construct the PowerShell command
const powershell = spawn('powershell', [
    '-ExecutionPolicy', 'Bypass',
    '-File', psScriptPath,
    '-comPort', comPort
]);

var prevData = ""; 
// Stream stdout (standard output)
powershell.stdout.on('data', (data) => {
    // prevData=data; 
    
    console.log(`stdout: ${data}`);
});

// Stream stderr (standard error)
powershell.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// Handle process exit
powershell.on('close', (code) => {
    console.log(`PowerShell process exited with code ${code}`);
});