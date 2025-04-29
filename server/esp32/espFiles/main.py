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

# Accelerometer (MPU6050)
peripherals["accelerometer"] = MPU6050(simulate=True)
peripherals_pins["accelerometer"] = {"sda": 21, "scl": 22}  # I2C pins

# DHT Sensor
peripherals["dht_sensor"] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals_pins["dht_sensor"] = {"data": 4}

# Encoder
peripherals["encoder"] = Encoder(pin_a=32, pin_b=33, simulate=True)
peripherals_pins["encoder"] = {"a": 32, "b": 33}

# Gas Sensor
peripherals["gas_sensor"] = GasSensor(pin=35, analog=True, simulate=True)
peripherals_pins["gas_sensor"] = {"sensor": 35}

# LED
peripherals["led"] = LED(pin=2, active_high=True, simulate=True)
peripherals_pins["led"] = {"control": 2}

# Internal LED
peripherals["internal_led"] = InternalLED(simulate=False)
peripherals_pins["internal_led"] = {}  # No external pins needed

# Motion Sensor
peripherals["motion_sensor"] = MotionSensor(pin=13, simulate=True)
peripherals_pins["motion_sensor"] = {"sensor": 13}

# Push Button
peripherals["push_button"] = PushButton(pin=0, simulate=True, debounce_ms=50)
peripherals_pins["push_button"] = {"button": 0}

# Relay
peripherals["relay"] = Relay(pin=26, active_high=True, simulate=True)
peripherals_pins["relay"] = {"control": 26}

# Servo Motor
peripherals["servo_motor"] = Servo(pin=15, freq=50, min_us=500, max_us=2500, angle_range=180)
peripherals_pins["servo_motor"] = {"pwm": 15}

# Slide Switch
peripherals["slide_switch"] = SlideSwitch(pin=34, simulate=True)
peripherals_pins["slide_switch"] = {"switch": 34}
def read_methods(peripherals):
    result = {}
    for peripheral_name, peripheral_obj in peripherals.items():
        try:
            # Check if 'accelerometer' is in peripherals and initialize result structure if needed
            if 'accelerometer' in peripherals and 'accelerometer' not in result:
                result['accelerometer'] = {'err': {}}
            
            # Call read_accel method for accelerometer
            if 'accelerometer' in peripherals:
                try:
                    result['accelerometer']['read_accel'] = peripherals['accelerometer'].read_accel()
                except Exception as err:
                    result['accelerometer']['err']['read_accel'] = str(err)
                    
                # Call read_gyro method for accelerometer
                try:
                    result['accelerometer']['read_gyro'] = peripherals['accelerometer'].read_gyro()
                except Exception as err:
                    result['accelerometer']['err']['read_gyro'] = str(err)
                    
                # Call read_all method for accelerometer
                try:
                    result['accelerometer']['read_all'] = peripherals['accelerometer'].read_all()
                except Exception as err:
                    result['accelerometer']['err']['read_all'] = str(err)
            
            # Check if 'dht_sensor' is in peripherals and initialize result structure if needed
            if 'dht_sensor' in peripherals and 'dht_sensor' not in result:
                result['dht_sensor'] = {'err': {}}
            
            # Call temperature method for dht_sensor
            if 'dht_sensor' in peripherals:
                try:
                    result['dht_sensor']['temperature'] = peripherals['dht_sensor'].temperature()
                except Exception as err:
                    result['dht_sensor']['err']['temperature'] = str(err)
                    
                # Call humidity method for dht_sensor
                try:
                    result['dht_sensor']['humidity'] = peripherals['dht_sensor'].humidity()
                except Exception as err:
                    result['dht_sensor']['err']['humidity'] = str(err)
            
            # Check if 'encoder' is in peripherals and initialize result structure if needed
            if 'encoder' in peripherals and 'encoder' not in result:
                result['encoder'] = {'err': {}}
            
            # Call get_position method for encoder
            if 'encoder' in peripherals:
                try:
                    result['encoder']['get_position'] = peripherals['encoder'].get_position()
                except Exception as err:
                    result['encoder']['err']['get_position'] = str(err)
        
        except Exception as err:
            print(f"Error in read process: {err}")
        # For the peripheral gas_sensor with method 'read'
        if peripheral_name == 'gas_sensor':
            if 'read' not in result[peripheral_name]:
                result[peripheral_name]['read'] = {}
            try:
                result[peripheral_name]['read']['value'] = peripheral_obj.read()
                result[peripheral_name]['read']['status'] = 'success'
            except Exception as err:
                result[peripheral_name]['read']['status'] = 'error'
                if 'err' not in result[peripheral_name]:
                    result[peripheral_name]['err'] = {}
                result[peripheral_name]['err']['read'] = str(err)
        
        # For the peripheral led with method 'is_on'
        elif peripheral_name == 'led':
            if 'is_on' not in result[peripheral_name]:
                result[peripheral_name]['is_on'] = {}
            try:
                result[peripheral_name]['is_on']['value'] = peripheral_obj.is_on()
                result[peripheral_name]['is_on']['status'] = 'success'
            except Exception as err:
                result[peripheral_name]['is_on']['status'] = 'error'
                if 'err' not in result[peripheral_name]:
                    result[peripheral_name]['err'] = {}
                result[peripheral_name]['err']['is_on'] = str(err)
        
        # For the peripheral internal_led with method 'is_on'
        elif peripheral_name == 'internal_led':
            if 'is_on' not in result[peripheral_name]:
                result[peripheral_name]['is_on'] = {}
            try:
                result[peripheral_name]['is_on']['value'] = peripheral_obj.is_on()
                result[peripheral_name]['is_on']['status'] = 'success'
            except Exception as err:
                result[peripheral_name]['is_on']['status'] = 'error'
                if 'err' not in result[peripheral_name]:
                    result[peripheral_name]['err'] = {}
                result[peripheral_name]['err']['is_on'] = str(err)
        if peripheral_name not in result:
            result[peripheral_name] = {'val': {}, 'err': {}}
        
        if peripheral_name == "motion_sensor":
            try:
                result[peripheral_name]['val']['read'] = peripheral_obj.read()
            except Exception as err:
                result[peripheral_name]['err']['read'] = str(err)
        
        elif peripheral_name == "push_button":
            try:
                result[peripheral_name]['val']['is_pressed'] = peripheral_obj.is_pressed()
            except Exception as err:
                result[peripheral_name]['err']['is_pressed'] = str(err)
            
            try:
                result[peripheral_name]['val']['get_event'] = peripheral_obj.get_event()
            except Exception as err:
                result[peripheral_name]['err']['get_event'] = str(err)
        
        elif peripheral_name == "relay":
            try:
                result[peripheral_name]['val']['is_on'] = peripheral_obj.is_on()
            except Exception as err:
                result[peripheral_name]['err']['is_on'] = str(err)
        try:
            if isinstance(peripheral_obj, dict) and 'type' in peripheral_obj and peripheral_obj['type'] == 'servo_motor':
                try:
                    result[peripheral_name]['read_angle'] = peripheral_obj.read_angle()
                except Exception as err:
                    result[peripheral_name]['err']['read_angle'] = err
                
                try:
                    result[peripheral_name]['read_us'] = peripheral_obj.read_us()
                except Exception as err:
                    result[peripheral_name]['err']['read_us'] = err
            
            elif isinstance(peripheral_obj, dict) and 'type' in peripheral_obj and peripheral_obj['type'] == 'slide_switch':
                try:
                    result[peripheral_name]['read'] = peripheral_obj.read()
                except Exception as err:
                    result[peripheral_name]['err']['read'] = err
                
                try:
                    result[peripheral_name]['state'] = peripheral_obj.state
                except Exception as err:
                    result[peripheral_name]['err']['state'] = err
            
            elif hasattr(peripheral_obj, 'read_angle') and callable(getattr(peripheral_obj, 'read_angle')):
                try:
                    result[peripheral_name]['read_angle'] = peripheral_obj.read_angle()
                except Exception as err:
                    result[peripheral_name]['err']['read_angle'] = err
                
                try:
                    result[peripheral_name]['read_us'] = peripheral_obj.read_us()
                except Exception as err:
                    result[peripheral_name]['err']['read_us'] = err
            
            elif hasattr(peripheral_obj, 'read') and callable(getattr(peripheral_obj, 'read')):
                try:
                    result[peripheral_name]['read'] = peripheral_obj.read()
                except Exception as err:
                    result[peripheral_name]['err']['read'] = err
                
                if hasattr(peripheral_obj, 'state'):
                    try:
                        result[peripheral_name]['state'] = peripheral_obj.state
                    except Exception as err:
                        result[peripheral_name]['err']['state'] = err
        except Exception as err:
            result[peripheral_name]['err']['general'] = str(err)
    return result

import json
def callback(topic, msg, retained, properties=None):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    output_dict = {}
    # Check if accelerometer is in the message
    if "accelerometer" in msg:
        output_dict["accelerometer"] = {}
        
        # Handle read methods for accelerometer
        if "read_accel" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_accel"] = peripherals["accelerometer"].read_accel()
        
        if "read_gyro" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_gyro"] = peripherals["accelerometer"].read_gyro()
        
        if "read_all" in msg["accelerometer"]:
            output_dict["accelerometer"]["read_all"] = peripherals["accelerometer"].read_all()
    
    # Check if dht_sensor is in the message
    if "dht_sensor" in msg:
        output_dict["dht_sensor"] = {}
        
        # Handle read methods for dht_sensor
        if "temperature" in msg["dht_sensor"]:
            output_dict["dht_sensor"]["temperature"] = peripherals["dht_sensor"].temperature()
        
        if "humidity" in msg["dht_sensor"]:
            output_dict["dht_sensor"]["humidity"] = peripherals["dht_sensor"].humidity()
        
        # Handle write methods for dht_sensor
        if "measure" in msg["dht_sensor"]:
            peripherals["dht_sensor"].measure()
            output_dict["dht_sensor"]["measure"] = {"status": "ok"}
    
    # Check if encoder is in the message
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
    # Check for gas_sensor peripheral
    if "gas_sensor" in msg:
        output_dict["gas_sensor"] = {}
        
        # Handle read methods for gas_sensor
        if "read" in msg["gas_sensor"]:
            read_result = peripherals["gas_sensor"].read()
            output_dict["gas_sensor"]["read"] = read_result
    
    # Check for led peripheral
    if "led" in msg:
        output_dict["led"] = {}
        
        # Handle write methods for led
        if "on" in msg["led"]:
            peripherals["led"].on()
            output_dict["led"]["on"] = {"status": "ok"}
        
        if "off" in msg["led"]:
            peripherals["led"].off()
            output_dict["led"]["off"] = {"status": "ok"}
        
        if "toggle" in msg["led"]:
            peripherals["led"].toggle()
            output_dict["led"]["toggle"] = {"status": "ok"}
        
        # Handle read methods for led
        if "is_on" in msg["led"]:
            is_on_result = peripherals["led"].is_on()
            output_dict["led"]["is_on"] = is_on_result
    
    # Check for internal_led peripheral
    if "internal_led" in msg:
        output_dict["internal_led"] = {}
        
        # Handle write methods for internal_led
        if "on" in msg["internal_led"]:
            peripherals["internal_led"].on()
            output_dict["internal_led"]["on"] = {"status": "ok"}
        
        if "off" in msg["internal_led"]:
            peripherals["internal_led"].off()
            output_dict["internal_led"]["off"] = {"status": "ok"}
        
        if "toggle" in msg["internal_led"]:
            peripherals["internal_led"].toggle()
            output_dict["internal_led"]["toggle"] = {"status": "ok"}
        
        # Handle read methods for internal_led
        if "is_on" in msg["internal_led"]:
            is_on_result = peripherals["internal_led"].is_on()
            output_dict["internal_led"]["is_on"] = is_on_result
    # Check if motion_sensor is in the message
    if "motion_sensor" in msg:
        output_dict["motion_sensor"] = {}
        
        # Handle read methods for motion_sensor
        if "read" in msg["motion_sensor"]:
            motion_state = peripherals["motion_sensor"].read()
            output_dict["motion_sensor"]["read"] = motion_state
        
        # Handle write methods for motion_sensor
        if "wait_for_motion" in msg["motion_sensor"]:
            timeout = msg["motion_sensor"]["wait_for_motion"].get("timeout", 10)
            result = peripherals["motion_sensor"].wait_for_motion(timeout)
            output_dict["motion_sensor"]["wait_for_motion"] = result
    
    # Check if push_button is in the message
    if "push_button" in msg:
        output_dict["push_button"] = {}
        
        # Handle read methods for push_button
        if "is_pressed" in msg["push_button"]:
            pressed_state = peripherals["push_button"].is_pressed()
            output_dict["push_button"]["is_pressed"] = pressed_state
        
        if "get_event" in msg["push_button"]:
            event_state = peripherals["push_button"].get_event()
            output_dict["push_button"]["get_event"] = event_state
        
        # Handle write methods for push_button
        if "set_simulated_state" in msg["push_button"]:
            pressed = msg["push_button"]["set_simulated_state"].get("pressed", False)
            peripherals["push_button"].set_simulated_state(pressed)
            output_dict["push_button"]["set_simulated_state"] = {"status": "ok"}
        
        if "push" in msg["push_button"]:
            peripherals["push_button"].push()
            output_dict["push_button"]["push"] = {"status": "ok"}
    
    # Check if relay is in the message
    if "relay" in msg:
        output_dict["relay"] = {}
        
        # Handle read methods for relay
        if "is_on" in msg["relay"]:
            relay_state = peripherals["relay"].is_on()
            output_dict["relay"]["is_on"] = relay_state
        
        # Handle write methods for relay
        if "on" in msg["relay"]:
            peripherals["relay"].on()
            output_dict["relay"]["on"] = {"status": "ok"}
        
        if "off" in msg["relay"]:
            peripherals["relay"].off()
            output_dict["relay"]["off"] = {"status": "ok"}
        
        if "toggle" in msg["relay"]:
            peripherals["relay"].toggle()
            output_dict["relay"]["toggle"] = {"status": "ok"}
    # Check if the message contains data for the servo_motor peripheral
    if "servo_motor" in msg:
        output_dict["servo_motor"] = {}
        
        # Handle read methods for servo_motor
        if "read_methods" in msg["servo_motor"]:
            read_methods = msg["servo_motor"]["read_methods"]
            
            if "read_angle" in read_methods:
                output_dict["servo_motor"]["read_angle"] = peripherals["servo_motor"].read_angle()
            
            if "read_us" in read_methods:
                output_dict["servo_motor"]["read_us"] = peripherals["servo_motor"].read_us()
        
        # Handle write methods for servo_motor
        if "write_methods" in msg["servo_motor"]:
            write_methods = msg["servo_motor"]["write_methods"]
            
            if "write_angle" in write_methods:
                angle = write_methods["write_angle"]
                peripherals["servo_motor"].write_angle(angle)
                output_dict["servo_motor"]["write_angle"] = {"status": "ok"}
            
            if "write_us" in write_methods:
                us = write_methods["write_us"]
                peripherals["servo_motor"].write_us(us)
                output_dict["servo_motor"]["write_us"] = {"status": "ok"}
            
            if "deinit" in write_methods:
                peripherals["servo_motor"].deinit()
                output_dict["servo_motor"]["deinit"] = {"status": "ok"}
    
    # Check if the message contains data for the slide_switch peripheral
    if "slide_switch" in msg:
        output_dict["slide_switch"] = {}
        
        # Handle read methods for slide_switch
        if "read_methods" in msg["slide_switch"]:
            read_methods = msg["slide_switch"]["read_methods"]
            
            if "read" in read_methods:
                output_dict["slide_switch"]["read"] = peripherals["slide_switch"].read()
            
            if "state" in read_methods:
                output_dict["slide_switch"]["state"] = peripherals["slide_switch"].state
        
        # Handle write methods for slide_switch
        if "write_methods" in msg["slide_switch"]:
            write_methods = msg["slide_switch"]["write_methods"]
            
            if "set_simulated_state" in write_methods:
                state = write_methods["set_simulated_state"]
                peripherals["slide_switch"].set_simulated_state(state)
                output_dict["slide_switch"]["set_simulated_state"] = {"status": "ok"}
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

async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        result = read_methods(peripherals)
        if(result['err']):
            await client.publish('esp32/0/sender', '{}'.format(json.dumps(result[err])), qos = 1)
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
