import { spawn } from "child_process";

function readPorts(getPorts){
 
    // console.log("getting connected ports") ; 
    const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/getPorts.ps1';
    const response = new Set() ; 
    // Construct the PowerShell command
    const powershell = spawn('powershell', [
        '-ExecutionPolicy', 'Bypass',
        '-File', psScriptPath,
    ]);
    
    powershell.stdout.on('data', (data) => {        
        // console.log(`stdout: ${data}`);
        const strData = String(data); 
        
        if (strData.includes('COM')) {
            const comPort = strData.substring(strData.indexOf('COM') ,strData.indexOf('COM')+4 );
            response.add(comPort) ; 
        }
    });

    powershell.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    powershell.on('close', (code) => {
        console.log(`PowerShell process exited with code ${code}`);
        getPorts(response); 
    });

}


function readData(getData, runningTime = 20000){
    try{
        if (getData("")) { 
        const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/monitor.ps1';
        var strData = "";  
        // Construct the PowerShell command
        const powershell = spawn('powershell', [
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
        ]);
        
        setTimeout(function() {
                powershell.stdout.pause();
                powershell.kill('SIGINT');
            }, runningTime); 

        powershell.stdout.on('data', (data) => {        
            console.log(`stdout: ${data}`);
       
            if (!getData(data)){
                powershell.stdout.pause();
                powershell.kill('SIGINT');
            }  
        });
    
        powershell.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        powershell.on('close', (code) => {
            console.log(`PowerShell process exited with code ${code}`);
            console.log("reading data is completed"); 
            
        });
        } 
    } catch (err) {
        console.log("the process is killed "); 
    }
    
 
}

export {readPorts}; 
export {readData}; 
