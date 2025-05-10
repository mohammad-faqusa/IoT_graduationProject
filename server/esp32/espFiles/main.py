from accelerometer import MPU6050
from machine import I2C, Pin

# Initialize peripherals pins dictionary
peripherals_pins = {
    'accelerometer': {
        'sda': 21,
        'scl': 22
    }
}

# Initialize peripherals dictionary
peripherals = {}

# Initialize I2C for accelerometer
i2c = I2C(0, sda=Pin(peripherals_pins['accelerometer']['sda']), 
          scl=Pin(peripherals_pins['accelerometer']['scl']), freq=400000)

# Initialize MPU6050 accelerometer
peripherals['accelerometer'] = MPU6050(i2c=i2c, addr=0x68, simulate=False)

import json

from mqtt_as import MQTTClient, config
import asyncio

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

def callback(topic, msg, retained, properties=None):
    asyncio.create_task(async_callback(topic, msg, retained))

async def async_callback(topic, msg, retained):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    result = {}

    if(msg['pins']):
        result['pins'] = peripherals_pins
        result['status'] = True
        result['commandId'] = msg['commandId']
        await client.publish('esp32/3/sender', '{}'.format(json.dumps(result)), qos = 1)
        print("this is pins")
        return  # ✅ Terminate early
     
    print("don't run here : "); 
    value = peripherals[msg['peripheral']][msg['method']][msg['param']]
    
    result['peripheral'] = msg['peripheral']
    result['method'] = msg['method']
    
    result['value'] = value
    result['status'] = True
    result['commandId'] = msg['commandId']

    await client.publish('esp32/3/sender', '{}'.format(json.dumps(result)), qos = 1)

async def conn_han(client):
    await client.subscribe('esp32/3/receiver', 1)
    
async def main(client):
    await client.connect()
    n = 0
    esp_status = {}
    esp_status['id'] = 3
    while True:
        await asyncio.sleep(1)
        
        esp_status['times'] = n

        print('publish', n)
        # If WiFi is down the following will pause for the duration.
        await asyncio.sleep(1)
        await client.publish('esp32/online', json.dumps(esp_status), qos = 1)
        n += 1

config['subs_cb'] = callback
config['connect_coro'] = conn_han

MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors
