import { spawn } from "child_process";

function filterTopics(receivedData){
    receivedData = receivedData.split('\n');
    receivedData = receivedData.filter(topic => topic.indexOf('esp32/') == 0);
    receivedData = receivedData.map(topic => topic.split('/')[1]);
    receivedData = receivedData.map(topic => topic.split(' ')[0]);
    var set = new Set([...receivedData]);
    receivedData = [...set];   
    return receivedData; 
}

function getTopics(returnTopics, enable, enableToggle, runningTime=5000){
 
    if(enable){
        enableToggle(); 
        console.log("getting topics") ; 
        const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/mosquittoSub.ps1';
        var response = "" ; 
        // Construct the PowerShell command
        const powershell = spawn('powershell', [
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
        ]);

        setTimeout(function() {
            console.log("finished from getting topics") ;
            const topics = filterTopics(response); 
            console.log("this is topics : "); 
            console.log(topics); 

            returnTopics(topics);
            enableToggle(); 
            powershell.stdout.pause();
            powershell.kill('SIGINT');
        }, runningTime); 
        
        powershell.stdout.on('data', (data) => {  
            const strData = String(data); 
            response += strData; 
        });

        powershell.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        powershell.on('close', (code) => {
            console.log(`completed filtering topics`);
        });
        
    } else {
        console.log("cant generate process, because get Topics is already running"); 
    }


}

function readDataDemo(returnMessages, enable, toggleEnable, topic = "#", runningTime = 20000 ) {
    if(enable) {
        toggleEnable();
        const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/mosquittoSub.ps1';
        var strData = "";  
        // Construct the PowerShell command
        const powershell = spawn('powershell', [
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
            '-t', topic, 
        ]);

        powershell.stdout.on('data', (data) => {        
            console.log(String(data));
            strData += data; 
            if(!returnMessages(strData)) {
                toggleEnable(); 
                console.log("finished reading messages"); 
                powershell.stdout.pause();
                powershell.kill('SIGINT'); 

            } 
        });

        powershell.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        powershell.on('close', (code) => {
            console.log("reading data is completed"); 
        });

    } else {
        console.log("invalid request! the readDataDemo function is currently running..")

    }
    
}



function readMessages(returnMessages , enable, enableToggle, topic="#", runningTime = 20000){
    if (enable) {
        enableToggle();
        const psScriptPath = 'D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/scriptsPS/mosquittoSub.ps1';
        // Construct the PowerShell command
        const powershell = spawn('powershell', [
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
            '-t', `esp32/${topic}` 
        ]);

        var response = "" ; 

        setTimeout(function() {
                enableToggle(); 
                powershell.stdout.pause();
                powershell.kill('SIGINT');
            }, runningTime); 

        powershell.stdout.on('data', (data) => {
            response += String(data); 
            console.log(`stdout: ${data}`);

            if(!returnMessages(response)){
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
        
    } else {
        console.log("can't generate readMessage processing, becuase it is already running"); 

    }
        
}

export {getTopics}; 
export {readMessages}; 
export {readDataDemo}; 