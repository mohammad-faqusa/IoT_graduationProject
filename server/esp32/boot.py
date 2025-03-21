
    
import network
from mqtt_as import config
from mqtt_as import MQTTClient
import asyncio


config['ssid'] = "clear"
config['wifi_pw'] = "13141516"
config['server'] = "192.168.137.1"


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("clear", "13141516")

while not wlan.isconnected():
    pass

print("Connected to Wi-Fi:", wlan.ifconfig())

async def conn_han(client):
    await client.subscribe('esp32/10/writeFunctions', 1)
    await client.subscribe('esp32/10/dictVariables', 1)
    
