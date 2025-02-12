param(
    $name = "mohammad",
    $path="D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/examples"
)

& cd $path 
& mkdir $name
& cd $name
& New-Item -Name "$name.ino" -ItemType File