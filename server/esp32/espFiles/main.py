
    
from time import sleep
from mqtt_as import MQTTClient, config
import asyncio
import json
import random
 
from machine import Pin

led = Pin(2, Pin.OUT)

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

readP = False
readAll = False
currentTopic = ''
p = {}
p['led'] = ''

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
            
    if(textTopic == 'esp32/11/getDict'):
        readAll = True
    
    print((topic.decode(), msg.decode(), retained))

async def conn_han(client):
    await client.subscribe('esp32/11/getDict', 1)
    await client.subscribe('esp32/11/getSub/req', 1)
    
config['subs_cb'] = callback
config['connect_coro'] = conn_han

# Define the sendImmediate function
async def sendImmediateFunction(client):
    pSelected['sendImmediate'] = True 
    await client.publish(currentTopic, json.dumps(pSelected), qos=1)
    pSelected['sendImmediate'] = False 


async def main(client):
    global p
    global readP
    global readAll
    global currentTopic
    global pSelected

    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        print('publish', n)
        
        p['id'] = 11
        print('\nled:', p['led'],"\n")
        await asyncio.sleep(1)
        if readP:
            await client.publish(currentTopic , json.dumps(pSelected), qos = 1)
            readP = False
        if readAll:
            await client.publish('esp32/11/getDict' , json.dumps(p), qos = 1)
            readAll = False
        await asyncio.sleep(1)
        await client.publish('esp32/status', '11', qos = 1)
        n += 1





MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors

