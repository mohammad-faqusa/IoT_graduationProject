from accelerometer import MPU6050
from led import InternalLED

# Dictionary for peripheral pin connections
peripherals_pins = {
    'accelerometer': {'scl': 22, 'sda': 21},  # Standard I2C pins for ESP32
    'internal_led': {'pin': 2}  # Standard internal LED pin for ESP32
}

# Dictionary to store peripheral instances
peripherals = {}

# Initialize accelerometer (MPU6050)
peripherals['accelerometer'] = MPU6050(simulate=False)  # Using default addr=0x68, simulation off

# Initialize internal LED
peripherals['internal_led'] = InternalLED()  # Using default simulate=False

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

    if(msg['pins']):
        await client.publish('esp32/1/sender', '{}'.format(json.dumps(peripherals_pins)), qos = 1)
        return
 
    value = peripherals[msg['peripheral']][msg['method']][msg['param']]
    
    result = {}
    result['peripheral'] = msg['peripheral']
    result['method'] = msg['method']
    
    result['value'] = value
    result['status'] = True
    result['commandId'] = msg['commandId']

    await client.publish('esp32/1/sender', '{}'.format(json.dumps(result)), qos = 1)

async def conn_han(client):
    await client.subscribe('esp32/1/receiver', 1)
    
async def main(client):
    await client.connect()
    n = 0
    esp_status = {}
    esp_status['id'] = 1
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
