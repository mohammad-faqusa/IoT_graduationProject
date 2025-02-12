import { spawn } from "child_process";


function readDataDemo(returnMessages ,enableMessageFunc,   topic = "#", runningTime = 20000 ) {
        const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/mosquittoSub.ps1';
        console.log("the function is enabled");
        // Construct the PowerShell command
        const powershell = spawn('powershell', [
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
            '-t', topic, 
        ]);
        powershell.stdout.on('data', (data) => {
            returnMessages(String(data)); 
        });

        powershell.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        powershell.on('close', (code) => {
            console.log("reading data is completed"); 
        });
    
}

function outputData(topic, outputMessage, enable, toggleEnableOutputFun,  ip = "192.168.137.1" ) {
    
    if (enable){
    

    const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/mosquittoPublish.ps1';

    toggleEnableOutputFun(); 
    const psCommand = `mosquitto_pub -h ${ip} -t esp32/${topic}/output -m "${outputMessage}" ` ;

    console.log("the function output is enabled");
    console.log("this is output : " +  outputMessage); 

        // Construct the PowerShell command
        const powershell = spawn('powershell', [
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
            '-t', topic,
            '-ip', ip, 
            '-m', outputMessage 
        ]);
        powershell.stdout.on('data', (data) => {
            console.log(data); 
        });

        powershell.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        powershell.on('close', (code) => {
            toggleEnableOutputFun(); 
            console.log("reading data is completed"); 
        }); 
    } else {
        console.log("output overlap"); 
    }
    
    
    
}

export {readDataDemo}; 
export {outputData}; 