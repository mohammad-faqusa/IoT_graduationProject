const fs = require('fs')

exports.mainTemplate = (id, body, libraries, config = {ssid: 'clear', pass: '13141516', server: '192.168.137.1'}) => {
    return `
    
from time import sleep
from mqtt_as import MQTTClient, config
import asyncio
import json
${libraries} 

# Local configuration
config['ssid'] = '${config.ssid}'  # Optional on ESP8266
config['wifi_pw'] = '${config.pass}'
config['server'] = '${config.server}'  # Change to suit e.g. 'iot.eclipse.org'

readP = False
currentTopic = ''
p = {}

def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
    global readP
    global currentTopic
    currentTopic = topic.split('/')[1:-1]
    readP = True
    print((topic.decode(), msg.decode(), retained))

async def conn_han(client):
    await client.subscribe('esp32/${id}/getDict', 1)
    


config['subs_cb'] = callback
config['connect_coro'] = conn_han

${body}


MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors

`
}

exports.bootTemplate = (config = {ssid: 'clear', pass: '13141516', server: '192.168.137.1'}) => {
    return `
import network

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("${config.ssid}", "${config.pass}")

while not wlan.isconnected():
    pass

print("Connected to Wi-Fi:", wlan.ifconfig())
`
}
