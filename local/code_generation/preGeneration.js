
function getTemplate(peripherals){
    var result = `write esp32 micropython code for the given peripherals ${peripherals}, just write the code without adding any additional comments \n`
    // libraries 
    result += "// ** peripherals libraries : \n" ; 
    peripherals.forEach(element => {
        var line = "// " + element + " library if commonly used, else don't write \n"
        result += line ;
    });

    // pins connected 
    result += "// ** define pins \n"
    peripherals.forEach(element => {
        var line = "// " + element + " pin numbers connected, or i2c address \n ";
        result += line; 
    })

    result += "// ** write the above pins in dicitonary pins_dict, key : peripheral name, value : pins number conntected or address"

    //objects
    result += "// ** initialize objects from peirpherals libraries if their class exist, else don't initialize  \n"
    peripherals.forEach(element => {
        var line = "// initialize object of class " + element + " if it has class , else don't initialize \n ";
        result += line; 
    })

    
    result += "// ** type read functions for peripherals \n"
    peripherals.forEach(element => {
        var line = "// type all read functions for peripheral" + element + " and push function info (function name, arguments, return type) to peripheral_functions  \n ";
        result += line; 
    })
    
    result += "// ** type write functions for peripherals \n"
    peripherals.forEach(element => {
        var line = "// type all write functions for peripheral" + element + " if allow writing, else don't type. and push function info (function name, arguments, return type) to peripheral_functions \n ";
        result += line; 
    })
    
    result += "// ** write a dictionary called 'functions_dict' to store read/write functions above, key: function name, value : [info about function (return type, args), function itself]"; 

    result += "// ** dont write while loop "
    return result; 
}

function secondPart(ssid="clear", password="13141516", mqtt_host="192.168.137.1", mqtt_topic="", client_id="esp32_001") {
    var content = `\n
import network
from umqtt.simple import MQTTClient
from time import sleep
import ujson

# Wi-Fi credentials
WIFI_SSID = "${ssid}"
WIFI_PASS = "${password}"

# MQTT Broker details
MQTT_BROKER = "${mqtt_host}"
MQTT_CLIENT_ID = "${client_id}"
MQTT_TOPIC = b"${mqtt_topic}"


# Connect to Wi-Fi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASS)
    print("Connecting to Wi-Fi", end="")
    while not wlan.isconnected():
        print(".", end="")
        sleep(1)
    print("Wi-Fi Connected:", wlan.ifconfig())

# MQTT callback function (runs when a message is received)
def mqtt_callback(topic, msg):
    if topic == b'home/input':
        indata = ujson.loads(msg.decode())
        print(indata)
        message = ujson.dumps(peripheral_functions)
        client.publish(b'home/output', message)

# Connect to Wi-Fi
connect_wifi()

# Connect to MQTT Broker
client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER)
client.set_callback(mqtt_callback)
client.connect()
print("Connected to MQTT Broker")

# Subscribe to topic
client.subscribe(MQTT_TOPIC)
print(f"Subscribed to {MQTT_TOPIC}")

# Main loop
try:
    while True:
        client.check_msg()  # Check for incoming messages
        sleep(0.1)
except KeyboardInterrupt:
    client.disconnect()
    print("Disconnected from MQTT broker")`

return content; 
}
export {getTemplate}; 
export {secondPart}; 