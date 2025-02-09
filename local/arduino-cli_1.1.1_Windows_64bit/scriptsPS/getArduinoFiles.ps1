param(
    $filesPath="D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/examples"
)

& ls $filesPath | Select-Object -ExpandProperty Name