param(
    $p='COM3',
    $b='9600',
    $arduinoCliPath = "D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/arduino-cli.exe" 

)

& $arduinoCliPath monitor -p $p 
