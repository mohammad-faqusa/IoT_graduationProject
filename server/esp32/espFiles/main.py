from accelerometer import MPU6050
from led import InternalLED
from relay import Relay

# Initialize peripherals_pins dictionary to store pin connections
peripherals_pins = {
    'accelerometer': {'scl': 22, 'sda': 21},  # Default I2C pins for ESP32
    'internal_led': {'led_pin': 2},  # Default internal LED pin on most ESP32 boards
    'relay': {'pin': 5}  # Example GPIO pin for relay
}

# Initialize peripherals dictionary to store peripheral instances
peripherals = {}

# Initialize accelerometer (MPU6050)
peripherals['accelerometer'] = MPU6050(simulate=True)  # Using default values, simulation mode

# Initialize internal LED
peripherals['internal_led'] = InternalLED()  # Using default values (simulation=False)

# Initialize relay
peripherals['relay'] = Relay(pin=peripherals_pins['relay']['pin'], active_high=True, simulate=True)

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
    result['status'] = True
    result['commandId'] = msg['commandId']

    await client.publish('esp32/16/sender', '{}'.format(json.dumps(result)), qos = 1)

async def conn_han(client):
    await client.subscribe('esp32/2/receiver', 1)
    
async def main(client):
    await client.connect()
    n = 0
    esp_status = {}
    esp_status['id'] = 2
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
