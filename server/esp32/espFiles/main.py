
    
from time import sleep
from mqtt_as import MQTTClient, config
import asyncio
import json
import random
 

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

readP = False
p = {}

def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
    global readP
    readP = True
    print((topic.decode(), msg.decode(), retained))

async def conn_han(client):
    await client.subscribe('esp32/1/getDict', 1)
    


config['subs_cb'] = callback
config['connect_coro'] = conn_han


async def main(client):
    global p
    global readP

    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        print('publish', n)
        p['Keyboard'] = Keyboard(0, 180)
        p['Mouse'] = Mouse(0, 180)
        p['Monitor'] = Monitor(0, 180)
        
        p['id'] = 1
        print('\nKeyboard:', p['Keyboard'],'\nMouse:', p['Mouse'],'\nMonitor:', p['Monitor'],"\n")
        if readP:
            await client.publish('esp32/result', json.dumps(p), qos = 1)
            readP = False
        await asyncio.sleep(1)
        await client.publish('esp32/status', '1', qos = 1)
        n += 1


def Keyboard(min_val, max_val):
    return random.randint(min_val, max_val)
    

def Mouse(min_val, max_val):
    return random.randint(min_val, max_val)
    

def Monitor(min_val, max_val):
    return random.randint(min_val, max_val)
    




MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors

