from accelerometer import MPU6050
from dht_sensor import DHTSensor
from encoder import Encoder
from led import InternalLED
from push_button import PushButton

# Dictionary to store peripheral pin connections
peripherals_pins = {
    'accelerometer': {'i2c': 'default I2C bus'},
    'dht_sensor': {'pin': 4},
    'encoder': {'pin_a': 25, 'pin_b': 26},
    'internal_led': {'pin': 2},  # ESP32 internal LED is typically on GPIO2
    'push_button': {'pin': 0}    # ESP32 BOOT button is typically on GPIO0
}

# Dictionary to store peripheral instances
peripherals = {}

# Initialize accelerometer (MPU6050)
peripherals['accelerometer'] = MPU6050(simulate=True)

# Initialize DHT sensor
peripherals['dht_sensor'] = DHTSensor(pin=peripherals_pins['dht_sensor']['pin'], sensor_type="DHT22", simulate=True)

# Initialize encoder
peripherals['encoder'] = Encoder(pin_a=peripherals_pins['encoder']['pin_a'], 
                                pin_b=peripherals_pins['encoder']['pin_b'], 
                                simulate=True)

# Initialize internal LED
peripherals['internal_led'] = InternalLED(simulate=False)

# Initialize push button
peripherals['push_button'] = PushButton(pin=peripherals_pins['push_button']['pin'], 
                                       simulate=True, 
                                       debounce_ms=50)

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

    if(msg.get('pins')):
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
