
param (
    $p = 'COM3',
    $arduinoCliPath = "D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/arduino-cli.exe", 
    $examplesPath = "D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/examples",
    $f = 'hello',
    $fqbn = "esp32:esp32:esp32"
 )

$ardduinoFileDir = $examplesPath + "/$f/$f.ino"; 
if (-Not (Test-Path $arduinoCliPath)) {
    Write-Host "Error: arduino-cli.exe not found at $arduinoCliPath"
    exit 1
}


& $arduinoCliPath compile --fqbn $fqbn $ardduinoFileDir
& $arduinoCliPath upload -p $p --fqbn $fqbn $ardduinoFileDir
