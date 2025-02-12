import { spawn } from "child_process";


function readArduinoFiles(getArduinoFiles){
    const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/getArduinoFiles.ps1';

    const powershell = spawn('powershell', [
        '-ExecutionPolicy', 'Bypass',
        '-File', psScriptPath,
    ]);
    
    var response = "" ; 

    
    powershell.stdout.on('data', (data) => {        
        response+=data; 
    });

    powershell.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    var arduinoFiles = [] ; 
    powershell.on('close',  (code) => {
        arduinoFiles = response.split('\n'); 
        arduinoFiles = arduinoFiles.slice(0 , -1 ); 
        arduinoFiles = arduinoFiles.map(arduinoFile => arduinoFile.slice(0,-1)); 
        getArduinoFiles(arduinoFiles); 
    });

    return arduinoFiles; 
    
}

function flashEsp(fileName, port='COM3'){

    console.log("flashing esp32 with file " + fileName) ; 
    const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/flash.ps1';
    const comPort = port; 
    
    // Construct the PowerShell command
    const powershell = spawn('powershell', [
        '-ExecutionPolicy', 'Bypass',
        '-File', psScriptPath,
        '-p', comPort,
        '-f', fileName
    ]);
    
    powershell.stdout.on('data', (data) => {        
        console.log(`stdout: ${data}`);
    });

    powershell.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    powershell.on('close', (code) => {
        console.log(`PowerShell process exited with code ${code}`);
    });

}

export default flashEsp; 
export {readArduinoFiles}; 