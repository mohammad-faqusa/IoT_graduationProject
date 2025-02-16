
from machine import I2C, Pin
import servo
import gas_sensor
import stepper
from lcd import I2C_LCD

pins_dict = {
    'lcd_i2c': {'sda': 21, 'scl': 22, 'address': 0x27},
    'stepper_motor': {'step_pin': 14, 'dir_pin': 12},
    'servo_motor': {'pin': 13},
    'switch_output': {'pin': 32},
    'gas_sensor': {'pin': 34}
}

i2c = I2C(0, scl=Pin(pins_dict['lcd_i2c']['scl']), sda=Pin(pins_dict['lcd_i2c']['sda']))
lcd = I2C_LCD(i2c, pins_dict['lcd_i2c']['address'])
stepper_motor = stepper.StepperMotor(step_pin=pins_dict['stepper_motor']['step_pin'], dir_pin=pins_dict['stepper_motor']['dir_pin'])
servo_motor = servo.Servo(pin=pins_dict['servo_motor']['pin'])
switch_output = Pin(pins_dict['switch_output']['pin'], Pin.OUT)
gas_sensor = gas_sensor.GasSensor(pin=pins_dict['gas_sensor']['pin'])

peripheral_functions = []

def lcd_read():
    return lcd.read()

peripheral_functions.append(('lcd_read', [], 'str'))

def stepper_read():
    return stepper_motor.get_position()

peripheral_functions.append(('stepper_read', [], 'int'))

def servo_read():
    return servo_motor.get_angle()

peripheral_functions.append(('servo_read', [], 'int'))

def switch_read():
    return switch_output.value()

peripheral_functions.append(('switch_read', [], 'bool'))

def gas_read():
    return gas_sensor.read_value()

peripheral_functions.append(('gas_read', [], 'float'))

def lcd_write(data):
    lcd.write(data)

peripheral_functions.append(('lcd_write', ['str'], 'None'))

def stepper_write(steps):
    stepper_motor.move(steps)

peripheral_functions.append(('stepper_write', ['int'], 'None'))

def servo_write(angle):
    servo_motor.set_angle(angle)

peripheral_functions.append(('servo_write', ['int'], 'None'))

def switch_write(state):
    switch_output.value(state)

peripheral_functions.append(('switch_write', ['bool'], 'None'))

functions_dict = {func[0]: [func[1:], func[1]] for func in peripheral_functions}


import network
from umqtt.simple import MQTTClient
from time import sleep
import ujson

# Wi-Fi credentials
WIFI_SSID = "clear"
WIFI_PASS = "13141516"

# MQTT Broker details
MQTT_BROKER = "192.168.137.1"
MQTT_CLIENT_ID = "esp32_001"
MQTT_TOPIC = b""


# Connect to Wi-Fi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASS)
    print("Connecting to Wi-Fi", end="")
    while not wlan.isconnected():
        print(".", end="")
        sleep(1)
    print("Wi-Fi Connected:", wlan.ifconfig())

# MQTT callback function (runs when a message is received)
def mqtt_callback(topic, msg):
    if topic == b'home/input':
        indata = ujson.loads(msg.decode())
        print(indata)
        message = ujson.dumps(peripheral_functions)
        client.publish(b'home/output', message)

# Connect to Wi-Fi
connect_wifi()

# Connect to MQTT Broker
client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER)
client.set_callback(mqtt_callback)
client.connect()
print("Connected to MQTT Broker")

# Subscribe to topic
client.subscribe(MQTT_TOPIC)
print(f"Subscribed to {MQTT_TOPIC}")

# Main loop
try:
    while True:
        client.check_msg()  # Check for incoming messages
        sleep(0.1)
except KeyboardInterrupt:
    client.disconnect()
    print("Disconnected from MQTT broker")