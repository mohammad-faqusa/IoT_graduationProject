from accelerometer import MPU6050
from dht_sensor import DHTSensor
from encoder import Encoder
from gas_sensor import GasSensor
from led import LED
from led import InternalLED
from motion_sensor import MotionSensor
from push_button import PushButton
from relay import Relay
from servo_motor import Servo
from slide_switch import SlideSwitch

# Initialize pins dictionary
peripherals_pins = {}

# Initialize peripherals dictionary
peripherals = {}

# Initialize accelerometer (MPU6050)
peripherals["accelerometer"] = MPU6050(simulate=True)
peripherals_pins["accelerometer"] = {"sda": 21, "scl": 22}

# Initialize DHT sensor
peripherals["dht_sensor"] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals_pins["dht_sensor"] = {"data": 4}

# Initialize encoder
peripherals["encoder"] = Encoder(pin_a=12, pin_b=13, simulate=True)
peripherals_pins["encoder"] = {"pin_a": 12, "pin_b": 13}

# Initialize gas sensor
peripherals["gas_sensor"] = GasSensor(pin=33, analog=True, simulate=True)
peripherals_pins["gas_sensor"] = {"sensor": 33}

# Initialize LED
peripherals["led"] = LED(pin=27, active_high=True, simulate=True)
peripherals_pins["led"] = {"control": 27}

# Initialize internal LED
peripherals["internal_led"] = InternalLED(simulate=False)
peripherals_pins["internal_led"] = {"built_in": 2}  # ESP32 typically uses GPIO2 for internal LED

# Initialize motion sensor
peripherals["motion_sensor"] = MotionSensor(pin=14, simulate=True)
peripherals_pins["motion_sensor"] = {"pir": 14}

# Initialize push button
peripherals["push_button"] = PushButton(pin=15, simulate=True, debounce_ms=50)
peripherals_pins["push_button"] = {"button": 15}

# Initialize relay
peripherals["relay"] = Relay(pin=26, active_high=True, simulate=True)
peripherals_pins["relay"] = {"control": 26}

# Initialize servo motor
peripherals["servo_motor"] = Servo(pin=25, freq=50, min_us=500, max_us=2500, angle_range=180)
peripherals_pins["servo_motor"] = {"pwm": 25}

# Initialize slide switch
peripherals["slide_switch"] = SlideSwitch(pin=32, simulate=True)
peripherals_pins["slide_switch"] = {"state": 32}

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
