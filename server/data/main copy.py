from time import sleep
from mqtt_as import MQTTClient, config
import asyncio
import json
import random

from accelerometer import MPU6050
from dht_sensor import DHTSensor
from encoder import Encoder
from gas_sensor import GasSensor
from led import LED
from internal_led import InternalLED
from motion_sensor import MotionSensor
from push_button import PushButton
from relay import Relay
from servo_motor import Servo
from slide_switch import SlideSwitch

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
    print((topic.decode(), msg.decode(), retained))


async def conn_han(client):
    await client.subscribe('esp32/4/getDict', 1)
    await client.subscribe('esp32/4/getSub/req', 1)
    
async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        await client.publish('esp32/status', '4', qos = 1)
        n += 1

MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors

