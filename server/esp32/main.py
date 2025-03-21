
async def main(client):
    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(5)
        print('publish from deviceId : 10', n)
        # If WiFi is down the following will pause for the duration.
        await client.publish('result', ''.format(n), qos = 1)
        n += 1
        
def callback(topic, msg, retained, properties=None): 
    print((topic.decode(), msg.decode(), retained))


config['subs_cb'] = callback
config['connect_coro'] = conn_han


MQTTClient.DEBUG = True  
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  
