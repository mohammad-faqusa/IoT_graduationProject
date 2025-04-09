const fs = require('fs')

exports.mainTemplate = (id, body, libraries,initP, config = {ssid: 'clear', pass: '13141516', server: '192.168.137.1'}) => {
    return `
    
from time import sleep
from mqtt_as import MQTTClient, config
import asyncio
import json
${libraries} 
from machine import Pin

led = Pin(2, Pin.OUT)

# Local configuration
config['ssid'] = '${config.ssid}'  # Optional on ESP8266
config['wifi_pw'] = '${config.pass}'
config['server'] = '${config.server}'  # Change to suit e.g. 'iot.eclipse.org'

readP = False
readAll = False
currentTopic = ''
p = {}
${initP}
pfunctions = {}
pSelected = {} 

def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
    global readP
    global readAll
    global currentTopic
    global pSelected
    global p
    global led
    textTopic = topic.decode()
    msgObj = json.loads(msg.decode())
    
    topicArr = textTopic.split('/')
    if(topicArr[-1] == 'req'):
        currentTopic = '/'.join(topicArr[0:-1]) + '/res'
        if(topicArr[-2] == 'getSub'):
            pSelected = {} 
            for key, val in msgObj.items():
                print(key, val)
                if(val != ''):
                    print(key, val)
                    if(key =='led'):
                        if(val):
                            led.value(1)
                        else:
                            led.value(0)
                        
                    p[key] = val
                    pSelected[key] = p[key]
                    asyncio.create_task(sendImmediateFunction(client))
                else:
                    pSelected[key] = p[key] 
            readP = True
            
    if(textTopic == 'esp32/${id}/getDict'):
        readAll = True
    
    print((topic.decode(), msg.decode(), retained))

async def conn_han(client):
    await client.subscribe('esp32/${id}/getDict', 1)
    await client.subscribe('esp32/${id}/getSub/req', 1)
    
config['subs_cb'] = callback
config['connect_coro'] = conn_han

# Define the sendImmediate function
async def sendImmediateFunction(client):
    pSelected['sendImmediate'] = True 
    await client.publish(currentTopic, json.dumps(pSelected), qos=1)
    pSelected['sendImmediate'] = False 

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
