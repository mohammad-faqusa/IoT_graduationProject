from accelerometer import MPU6050
from led import InternalLED
import time

# Define pin connections for each peripheral
peripherals_pins = {
    "accelerometer": {"sda": 21, "scl": 22},  # Common I2C pins for ESP32
    "internal_led": {"led_pin": 2}  # Default internal LED pin on most ESP32 boards
}

# Initialize peripherals
peripherals = {}

# Initialize accelerometer (MPU6050)
# Using default parameters: address 0x68 (104 decimal) and simulation mode True
peripherals["accelerometer"] = MPU6050(simulate=True)

# Initialize internal LED
# Using default parameter: simulation mode False
peripherals["internal_led"] = InternalLED(simulate=False)

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
    output_dict = {}
    result = peripherals[msg['peripheral']][msg['method']][msg['param']]
    await send_message(result)

async def conn_han(client):
    await client.subscribe('esp32/12/receiver', 1)

async def send_message(output_dict):
    print(output_dict);
    await client.publish('esp32/12/sender', '{}'.format(json.dumps(output_dict)), qos = 1)

async def main(client):
    await client.connect()
    n = 0
    esp_status = {}
    esp_status['id'] = 12
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
