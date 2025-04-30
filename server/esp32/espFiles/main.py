from accelerometer import MPU6050
from led import InternalLED

# Initialize peripherals_pins dictionary
peripherals_pins = {
    'accelerometer': {'sda': 21, 'scl': 22},
    'internal_led': {'pin': 2}  # ESP32 typically has internal LED on pin 2
}

# Initialize peripherals dictionary
peripherals = {}

# Initialize accelerometer (MPU6050)
# Using default values: addr=0x68 (104 in decimal), simulate=True
peripherals['accelerometer'] = MPU6050(simulate=True)

# Initialize internal LED
# Using default value: simulate=False
peripherals['internal_led'] = InternalLED(simulate=False)

import json
def callback(topic, msg, retained, properties=None):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    output_dict = {}
    # Check for accelerometer related commands
    if "accelerometer" in msg:
        output_dict["accelerometer"] = {}
        
        # Handle read_accel method
        if "read_accel" in msg["accelerometer"]:
            accel_data = peripherals["accelerometer"].read_accel()
            output_dict["accelerometer"]["read_accel"] = accel_data
        
        # Handle read_gyro method
        if "read_gyro" in msg["accelerometer"]:
            gyro_data = peripherals["accelerometer"].read_gyro()
            output_dict["accelerometer"]["read_gyro"] = gyro_data
        
        # Handle read_all method
        if "read_all" in msg["accelerometer"]:
            all_data = peripherals["accelerometer"].read_all()
            output_dict["accelerometer"]["read_all"] = all_data
    
    # Check for internal LED related commands
    if "internal_led" in msg:
        output_dict["internal_led"] = {}
        
        # Handle read method: is_on
        if "is_on" in msg["internal_led"]:
            led_state = peripherals["internal_led"].is_on()
            output_dict["internal_led"]["is_on"] = led_state
        
        # Handle write methods
        if "on" in msg["internal_led"]:
            peripherals["internal_led"].on()
            output_dict["internal_led"]["on"] = {"status": "ok"}
        
        if "off" in msg["internal_led"]:
            peripherals["internal_led"].off()
            output_dict["internal_led"]["off"] = {"status": "ok"}
        
        if "toggle" in msg["internal_led"]:
            peripherals["internal_led"].toggle()
            output_dict["internal_led"]["toggle"] = {"status": "ok"}
    # Run the async sender from sync context
    asyncio.create_task(send_message(output_dict))
from mqtt_as import MQTTClient, config
import asyncio

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

async def conn_han(client):
    await client.subscribe('esp32/6/receiver', 1)

async def send_message(output_dict):
    print(output_dict);
    await client.publish('esp32/6/sender', '{}'.format(json.dumps(output_dict)), qos = 1)

async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        
        print('publish', n)
        # If WiFi is down the following will pause for the duration.
        await asyncio.sleep(1)
        await client.publish('esp32/online', json.dumps({"id": 6, "times":n), qos = 1)
        n += 1

config['subs_cb'] = callback
config['connect_coro'] = conn_han

MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors
