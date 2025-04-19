
    
from time import sleep
from mqtt_as import MQTTClient, config
import asyncio
import json
import random

from dht import dht 
from servo import servo 
from led import led 


#get the connected pins 
    #pins for digital input/ouput 
    #pins for analog input
    #pins for pwm 
    #i2c 

#read/write functions 
    #get info 
    #get specific vlue 
    #write specific variable 

#sub, publish values 
    #emergency 
    #periodically 
    #callback 

#read periodicly, 
    #sensors 

#device id , device name 

 
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
p['servo'] = ''
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
            
    if(textTopic == 'esp32/4/getDict'):
        readAll = True
    
    print((topic.decode(), msg.decode(), retained))

async def conn_han(client):
    await client.subscribe('esp32/4/getDict', 1)
    await client.subscribe('esp32/4/getSub/req', 1)
    
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
        p['motion'] = motion(0, 180)
        p['gas_sensor'] = gas_sensor(0, 180)
        
        p['id'] = 4
        print('\nservo:', p['servo'],'\nled:', p['led'],'\nmotion:', p['motion'],'\ngas_sensor:', p['gas_sensor'],"\n")
        await asyncio.sleep(1)
        if readP:
            await client.publish(currentTopic , json.dumps(pSelected), qos = 1)
            readP = False
        if readAll:
            await client.publish('esp32/4/getDict' , json.dumps(p), qos = 1)
            readAll = False
        await asyncio.sleep(1)
        await client.publish('esp32/status', '4', qos = 1)
        n += 1


def motion(min_val, max_val):
    return random.randint(min_val, max_val)
    

def gas_sensor(min_val, max_val):
    return random.randint(min_val, max_val)
    




MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors

