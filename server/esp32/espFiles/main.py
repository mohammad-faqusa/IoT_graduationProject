from accelerometer import MPU6050
from led import InternalLED

# Initialize peripherals_pins dictionary
peripherals_pins = {
    'accelerometer': {'sda': 21, 'scl': 22},
    'internal_led': {}  # Internal LED typically doesn't require pins to be specified
}

# Initialize peripherals dictionary
peripherals = {}

# Initialize MPU6050 (accelerometer)
from machine import I2C, Pin
i2c = I2C(0, scl=Pin(peripherals_pins['accelerometer']['scl']), sda=Pin(peripherals_pins['accelerometer']['sda']))
peripherals['accelerometer'] = MPU6050(i2c=i2c, addr=0x68, simulate=True)

# Initialize Internal LED
peripherals['internal_led'] = InternalLED(simulate=False)

import json
def callback(topic, msg, retained, properties=None):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    output_dict = {}
    # Get the peripheral names from the message
    if "accelerometer" in msg:
        # Initialize the peripheral in the output dictionary if not already present
        if "accelerometer" not in output_dict:
            output_dict["accelerometer"] = {}
        
        # Check for specific methods and execute them
        if "read_accel" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_accel"] = peripherals["accelerometer"].read_accel()
        
        if "read_gyro" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_gyro"] = peripherals["accelerometer"].read_gyro()
        
        if "read_all" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_all"] = peripherals["accelerometer"].read_all()
    
    if "internal_led" in msg:
        # Initialize the peripheral in the output dictionary if not already present
        if "internal_led" not in output_dict:
            output_dict["internal_led"] = {}
        
        # Check for specific methods and execute them
        if "on" in msg["internal_led"]:
            peripherals["internal_led"].on()
            output_dict["internal_led"]["on"] = {"status": "ok"}
        
        if "off" in msg["internal_led"]:
            peripherals["internal_led"].off()
            output_dict["internal_led"]["off"] = {"status": "ok"}
        
        if "toggle" in msg["internal_led"]:
            peripherals["internal_led"].toggle()
            output_dict["internal_led"]["toggle"] = {"status": "ok"}
        
        if "is_on" in msg["internal_led"]:
            output_dict["internal_led"]["is_on"] = peripherals["internal_led"].is_on()
    # Run the async sender from sync context
    asyncio.create_task(send_message(output_dict))
from mqtt_as import MQTTClient, config
import asyncio

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

async def conn_han(client):
    await client.subscribe('esp32/0/receiver', 1)

async def send_message(output_dict):
    print(output_dict);
    await client.publish('result', '{}'.format(json.dumps(output_dict)), qos = 1)

async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        
        print('publish', n)
        # If WiFi is down the following will pause for the duration.
        await asyncio.sleep(1)
        await client.publish('result', '{}'.format(n), qos = 1)
        n += 1

config['subs_cb'] = callback
config['connect_coro'] = conn_han

MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors
