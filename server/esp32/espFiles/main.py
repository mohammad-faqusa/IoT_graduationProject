from accelerometer import MPU6050
from led import InternalLED

# Initialize peripherals_pins dictionary to store connection information
peripherals_pins = {
    'accelerometer': {'sda': 21, 'scl': 22},
    'internal_led': {'pin': 2}  # ESP32 typically has internal LED on pin 2
}

# Initialize peripherals dictionary to store peripheral instances
peripherals = {}

# Initialize accelerometer
peripherals['accelerometer'] = MPU6050(simulate=True)

# Initialize internal LED
peripherals['internal_led'] = InternalLED(simulate=False)

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
 
    value = peripherals[msg['peripheral']][msg['method']][msg['param']]
    result = {}
    result['peripheral'] = msg['peripheral']
    result['method'] = msg['method']
    result['value'] = value

    await client.publish('esp32/16/sender', '{}'.format(json.dumps(result)), qos = 1)

async def conn_han(client):
    await client.subscribe('esp32/16/receiver', 1)
    
async def main(client):
    await client.connect()
    n = 0
    esp_status = {}
    esp_status['id'] = 16
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
