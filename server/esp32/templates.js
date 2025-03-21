const fs = require('fs')

const bootTemplate = (id, config = {ssid: 'clear', pass: '13141516', server: '192.168.137.1'}) => {
    return `
    
import network
from mqtt_as import config
from mqtt_as import MQTTClient
import asyncio


config['ssid'] = "${config.ssid}"
config['wifi_pw'] = "${config.pass}"
config['server'] = "${config.server}"


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("clear", "13141516")

while not wlan.isconnected():
    pass

print("Connected to Wi-Fi:", wlan.ifconfig())

async def conn_han(client):
    await client.subscribe('esp32/${id}/writeFunctions', 1)
    await client.subscribe('esp32/${id}/dictVariables', 1)
    
`
}

const mainTemplate = (id, peripherals = [])=> {

    return `
async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(5)
        print('publish from deviceId : ${id}', n)
        # If WiFi is down the following will pause for the duration.
        await client.publish('result', ''.format(n), qos = 1)
        n += 1
        
def callback(topic, msg, retained, properties=None): 
    print((topic.decode(), msg.decode(), retained))


config['subs_cb'] = callback
config['connect_coro'] = conn_han


MQTTClient.DEBUG = True  
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  
`
}

const writeFiles = (id) => {
    fs.writeFileSync('main.py', mainTemplate(id));
    fs.writeFileSync('boot.py', bootTemplate(id));
    
}

module.exports = writeFiles; 
