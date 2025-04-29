from mqtt_as import MQTTClient, config
import asyncio

def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
    print((topic.decode(), msg.decode(), retained))

#topics : esp32/deviceId: 
    #read methods 
    #write methods 
    #properties
    #test
    #util: 
    
    # read {method_name: 'parameter_values', send back what returns } , write : {maethod_name : 'parameters values'}, properties : {read_methods: {method: {name, parameter_data_types, }}, write_methods: {}}
    #

    #online status 
objectMsg = {
    "read": {
      
    },
    "write":{
        
    },
    "properties":{
        "temperature": {
        "returns": {
          "dataType": "Number",
          "unit": "°C",
          "range": {
            "min": -40,
            "max": 125
          }
        },
        "purpose": "Returns the last measured temperature value. Range: -40°C to 125°C"
        },
        "humidity": {
            "returns": {
            "dataType": "Number",
            "unit": "%",
            "range": {
                "min": 0,
                "max": 100
            }
            },
            "purpose": "Returns the last measured humidity value. Range: 0% to 100%"
        },
        "measure": {
            "returns": "void",
            "purpose": "Triggers the sensor to update temperature and humidity readings"
        }
      

    },
    "util":{

    }
}

async def conn_han(client):
    await client.subscribe('foo_topic', 1)

async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(5)
        print('publish', n)
        # If WiFi is down the following will pause for the duration.
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