from dht_sensor import DHTSensor
from gas_sensor import GasSensor
from servo_motor import Servo

# Initialize peripherals_pins dictionary
peripherals_pins = {}

# Initialize peripherals dictionary
peripherals = {}

# Initialize DHT sensor (using pin 4, type DHT22, simulation mode by default)
peripherals['dht_sensor'] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals_pins['dht_sensor'] = {'pin': 4}

# Initialize Gas sensor (using pin 36, analog mode, simulation mode by default)
peripherals['gas_sensor'] = GasSensor(pin=36, analog=True, simulate=True)
peripherals_pins['gas_sensor'] = {'pin': 36}

# Initialize Servo motor (using pin 18, default parameters)
peripherals['servo_motor'] = Servo(pin=18, freq=50, min_us=500, max_us=2500, angle_range=180)
peripherals_pins['servo_motor'] = {'pin': 18}

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
