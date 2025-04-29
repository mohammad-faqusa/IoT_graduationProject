from accelerometer import MPU6050
from dht_sensor import DHTSensor
from encoder import Encoder
from gas_sensor import GasSensor
from led import LED
from led import InternalLED

# Initialize pins dictionary
peripherals_pins = {
    'accelerometer': {'sda': 21, 'scl': 22},
    'dht_sensor': {'pin': 4},
    'encoder': {'pin_a': 32, 'pin_b': 33},
    'gas_sensor': {'pin': 34},
    'led': {'pin': 25},
    'internal_led': {}
}

# Initialize peripherals dictionary
peripherals = {}

# Initialize each peripheral
peripherals['accelerometer'] = MPU6050(simulate=True)
peripherals['dht_sensor'] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals['encoder'] = Encoder(pin_a=32, pin_b=33, simulate=True)
peripherals['gas_sensor'] = GasSensor(pin=34, analog=True, simulate=True)
peripherals['led'] = LED(pin=25, active_high=True, simulate=True)
peripherals['internal_led'] = InternalLED(simulate=False)

def read_methods(peripherals):
    result = {}
    for peripheral_name, peripheral_obj in peripherals.items():
        if peripheral_name == "accelerometer":
            if not "accelerometer" in result:
                result["accelerometer"] = {}
            
            # read_accel method
            try:
                accel_values = peripheral_obj.read_accel()
                result["accelerometer"]["read_accel"] = accel_values
            except Exception as err:
                if not "err" in result["accelerometer"]:
                    result["accelerometer"]["err"] = {}
                result["accelerometer"]["err"]["read_accel"] = err
            
            # read_gyro method
            try:
                gyro_values = peripheral_obj.read_gyro()
                result["accelerometer"]["read_gyro"] = gyro_values
            except Exception as err:
                if not "err" in result["accelerometer"]:
                    result["accelerometer"]["err"] = {}
                result["accelerometer"]["err"]["read_gyro"] = err
            
            # read_all method
            try:
                all_values = peripheral_obj.read_all()
                result["accelerometer"]["read_all"] = all_values
            except Exception as err:
                if not "err" in result["accelerometer"]:
                    result["accelerometer"]["err"] = {}
                result["accelerometer"]["err"]["read_all"] = err
        
        elif peripheral_name == "dht_sensor":
            if not "dht_sensor" in result:
                result["dht_sensor"] = {}
            
            # temperature method
            try:
                temp_value = peripheral_obj.temperature()
                result["dht_sensor"]["temperature"] = temp_value
            except Exception as err:
                if not "err" in result["dht_sensor"]:
                    result["dht_sensor"]["err"] = {}
                result["dht_sensor"]["err"]["temperature"] = err
            
            # humidity method
            try:
                humidity_value = peripheral_obj.humidity()
                result["dht_sensor"]["humidity"] = humidity_value
            except Exception as err:
                if not "err" in result["dht_sensor"]:
                    result["dht_sensor"]["err"] = {}
                result["dht_sensor"]["err"]["humidity"] = err
        
        elif peripheral_name == "encoder":
            if not "encoder" in result:
                result["encoder"] = {}
            
            # get_position method
            try:
                position = peripheral_obj.get_position()
                result["encoder"]["get_position"] = position
            except Exception as err:
                if not "err" in result["encoder"]:
                    result["encoder"]["err"] = {}
                result["encoder"]["err"]["get_position"] = err
        # Loop is already provided: for peripheral_name, peripheral_obj in peripherals.items():
        if peripheral_name == 'gas_sensor':
            try:
                result[peripheral_name]['read'] = peripheral_obj.read()
            except Exception as err:
                result[peripheral_name]['err']['read'] = err
        
        elif peripheral_name == 'led':
            try:
                result[peripheral_name]['is_on'] = peripheral_obj.is_on()
            except Exception as err:
                result[peripheral_name]['err']['is_on'] = err
        
        elif peripheral_name == 'internal_led':
            try:
                result[peripheral_name]['is_on'] = peripheral_obj.is_on()
            except Exception as err:
                result[peripheral_name]['err']['is_on'] = err
    return result

def callback(topic, msg, retained, properties=None):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    output_dict = {}
    # Check for accelerometer commands
    if "accelerometer" in msg:
        output_dict["accelerometer"] = {}
        
        # Handle read methods for accelerometer
        if "read_accel" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_accel"] = peripherals["accelerometer"].read_accel()
        
        if "read_gyro" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_gyro"] = peripherals["accelerometer"].read_gyro()
        
        if "read_all" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_all"] = peripherals["accelerometer"].read_all()
    
    # Check for DHT sensor commands
    if "dht_sensor" in msg:
        output_dict["dht_sensor"] = {}
        
        # Handle read methods for DHT sensor
        if "temperature" in msg["dht_sensor"]:
            output_dict["dht_sensor"]["temperature"] = peripherals["dht_sensor"].temperature()
        
        if "humidity" in msg["dht_sensor"]:
            output_dict["dht_sensor"]["humidity"] = peripherals["dht_sensor"].humidity()
        
        # Handle write methods for DHT sensor
        if "measure" in msg["dht_sensor"]:
            peripherals["dht_sensor"].measure()
            output_dict["dht_sensor"]["measure"] = {"status": "ok"}
    
    # Check for encoder commands
    if "encoder" in msg:
        output_dict["encoder"] = {}
        
        # Handle read methods for encoder
        if "get_position" in msg["encoder"]:
            output_dict["encoder"]["get_position"] = peripherals["encoder"].get_position()
        
        # Handle write methods for encoder
        if "reset" in msg["encoder"]:
            peripherals["encoder"].reset()
            output_dict["encoder"]["reset"] = {"status": "ok"}
        
        if "simulate_step" in msg["encoder"]:
            steps = msg["encoder"]["simulate_step"]
            peripherals["encoder"].simulate_step(steps)
            output_dict["encoder"]["simulate_step"] = {"status": "ok"}
    # Process gas_sensor peripheral
    if "gas_sensor" in msg:
        output_dict["gas_sensor"] = {}
        if "read" in msg["gas_sensor"]:
            output_dict["gas_sensor"]["read"] = peripherals["gas_sensor"].read()
    
    # Process led peripheral
    if "led" in msg:
        output_dict["led"] = {}
        if "on" in msg["led"]:
            peripherals["led"].on()
            output_dict["led"]["on"] = {"status": "ok"}
        if "off" in msg["led"]:
            peripherals["led"].off()
            output_dict["led"]["off"] = {"status": "ok"}
        if "toggle" in msg["led"]:
            peripherals["led"].toggle()
            output_dict["led"]["toggle"] = {"status": "ok"}
        if "is_on" in msg["led"]:
            output_dict["led"]["is_on"] = peripherals["led"].is_on()
    
    # Process internal_led peripheral
    if "internal_led" in msg:
        output_dict["internal_led"] = {}
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
    await client.subscribe('foo_topic', 1)

async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        result = read_methods(peripherals)
        if(result['err']):
            await client.publish('result', '{}'.format(json.dumps(result[err])), qos = 1)
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