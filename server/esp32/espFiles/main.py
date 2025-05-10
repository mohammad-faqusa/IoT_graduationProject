from dht_sensor import DHTSensor
from led import InternalLED
from servo_motor import Servo

# Initialize peripherals_pins dictionary
peripherals_pins = {
    'dht_sensor': {'pin': 4},
    'internal_led': {'pin': 2},  # Internal LED pin is typically 2 on ESP32
    'servo_motor': {'pin': 13}
}

# Initialize peripherals dictionary
peripherals = {}

# Initialize each peripheral
peripherals['dht_sensor'] = DHTSensor(
    pin=peripherals_pins['dht_sensor']['pin'],
    sensor_type="DHT22",
    simulate=True
)

peripherals['internal_led'] = InternalLED(
    simulate=False
)

peripherals['servo_motor'] = Servo(
    pin_id=peripherals_pins['servo_motor']['pin'],
    min_us=544,
    max_us=2400,
    min_deg=0,
    max_deg=180,
    freq=50
)

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
        await client.publish('esp32/1/sender', '{}'.format(json.dumps(result)), qos = 1)
        print("this is pins")
        return  # ✅ Terminate early
     
    print("don't run here : "); 
    value = peripherals[msg['peripheral']][msg['method']][msg['param']]
    
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
