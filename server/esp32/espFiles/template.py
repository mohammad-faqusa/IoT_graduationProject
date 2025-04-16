from mqtt_as import MQTTClient, config
import asyncio
import json

# Local configuration
config['ssid'] = 'clear'  # Optional on ESP8266
config['wifi_pw'] = '13141516'
config['server'] = '192.168.137.1'  # Change to suit e.g. 'iot.eclipse.org'

def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
    print(topic, msg)

