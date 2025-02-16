import paho.mqtt.client as mqtt
import json

# MQTT Broker Settings
broker = "192.168.137.1"
topic = "home/input"

# Data to send
data = {"device": "ESP32", "status": "active", "value": 42, "func1":"read_dht"}
json_data = json.dumps(data)

# Publish Data
client = mqtt.Client()
client.connect(broker, 1883, 60)
client.publish(topic, json_data)
client.disconnect()

print(f"Sent JSON: {json_data}")
