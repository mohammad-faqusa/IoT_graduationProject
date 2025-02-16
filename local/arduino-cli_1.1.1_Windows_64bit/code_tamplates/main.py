
# ** peripherals libraries:
from machine import Pin, PWM
import dht  # DHT sensor library
import time

# Assume gas sensor library is written elsewhere
# This is a placeholder for importing it
# from gas_sensor import GasSensor 

# ** define pins
DHT_PIN = 14        # Change as per your wiring
GAS_SENSOR_PIN = 32  # Define according to your setup
SERVO_PIN = 15      # Change as per your wiring
OUT_SWITCH1_PIN = 27  # Change as per your wiring
OUT_SWITCH2_PIN = 26  # Change as per your wiring

# ** initialize objects from peripherals libraries
dht_sensor = dht.DHT11(Pin(DHT_PIN))  # Initialize DHT sensor
# gas_sensor = GasSensor(GAS_SENSOR_PIN)  # Initialize gas sensor (if it has a class)
servo_motor = PWM(Pin(SERVO_PIN), freq=50)  # Initialize servo motor
output_switch1 = Pin(OUT_SWITCH1_PIN, Pin.OUT)  # Output switch 1
output_switch2 = Pin(OUT_SWITCH2_PIN, Pin.OUT)  # Output switch 2

# ** type read functions for peripherals
def read_dht():
    dht_sensor.measure()
    return dht_sensor.temperature(), dht_sensor.humidity()  # Returns (temperature, humidity)

# def read_gas_sensor():
#     return gas_sensor.read()  # Add based on your gas sensor's read method

def read_servo():
    return servo_motor.duty()  # Returns PWM value for servo

def read_output_switch1():
    return output_switch1.value()  # Returns 0 (off) or 1 (on)

def read_output_switch2():
    return output_switch2.value()  # Returns 0 (off) or 1 (on)

# ** type write functions for peripherals
def write_servo(duty):
    servo_motor.duty(duty)  # Set PWM value for servo

def write_output_switch1(state):
    output_switch1.value(state)  # Set state of the output switch

def write_output_switch2(state):
    output_switch2.value(state)  # Set state of the output switch

# ** initialize peripheral_functions list to store information of read/write functions
peripheral_functions = []

# Adding read function info
peripheral_functions.append(('read_dht', [], '(temperature: int, humidity: int)'))
# peripheral_functions.append(('read_gas_sensor', [], 'return_type'))  # Adjust accordingly
peripheral_functions.append(('read_servo', [], 'return_type'))
peripheral_functions.append(('read_output_switch1', [], 'int'))
peripheral_functions.append(('read_output_switch2', [], 'int'))

# Adding write function info
peripheral_functions.append(('write_servo', ['duty: int'], 'void'))
peripheral_functions.append(('write_output_switch1', ['state: int'], 'void'))
peripheral_functions.append(('write_output_switch2', ['state: int'], 'void'))

# Display the available functions (for debugging/tracking purposes)
for func in peripheral_functions:
    print(func)

import network
from umqtt.simple import MQTTClient
from time import sleep
import ujson

# Wi-Fi credentials
WIFI_SSID = "clear"
WIFI_PASS = "13141516"

# MQTT Broker details
MQTT_BROKER = "192.168.137.1"
MQTT_CLIENT_ID = "esp32_client"
MQTT_TOPIC = b"home/input"

# LED setup (GPIO2 is built-in on ESP32)
led = Pin(2, Pin.OUT)

# Connect to Wi-Fi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASS)
    print("Connecting to Wi-Fi", end="")
    while not wlan.isconnected():
        print(".", end="")
        sleep(1)
    print("\nWi-Fi Connected:", wlan.ifconfig())

# MQTT callback function (runs when a message is received)
def mqtt_callback(topic, msg):
    if topic == b'home/input':
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


