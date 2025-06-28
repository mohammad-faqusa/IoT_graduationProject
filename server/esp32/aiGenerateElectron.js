const fs = require("fs");
const path = require("path");

const Device = require(path.join(__dirname, "./../models/Device"));

const { initializePeripheralsPrompt, seperatePinsPrompt } = require(path.join(
  __dirname,
  "generatePrompts"
));

const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./../data/peripherals_info.json"))
);
const callClaude = require(path.join(__dirname, "claude_console/lib/index"));

async function initializeCode(peripherals_dict) {
  console.log("this is dict : ", peripherals_dict);

  const plist = [...new Set(Object.values(peripherals_dict))];
  const libraries = peripherals_info
    .filter((p) => plist.includes(p.name))
    .map((p) => `from ${p.library_name} import ${p.class_name}`)
    .join("\n");
  console.log("this is libraries : ", libraries);
  const prompt = initializePeripheralsPrompt(peripherals_dict);
  const finalCode = await callClaude(prompt);
  // fs.writeFileSync(path.join(__dirname, "espFiles/main.py"), finalCode);
  fs.writeFileSync(path.join(__dirname, "initialize.py"), finalCode);

  return libraries + "\n" + finalCode;
}

async function seperatePins(pythonCode) {
  const prompt = seperatePinsPrompt(pythonCode);
  fs.writeFileSync(path.join(__dirname, "pinsPrompt.txt"), prompt);
  const pinsObject = await callClaude(prompt);
  fs.writeFileSync(
    path.join(__dirname, "pinSeperationResult.txt"),
    await pinsObject
  );
  return await pinsObject;
}

function mqtt_part2(
  id,
  network_config = {
    ssid: "clear",
    pass: "13141516",
    serverId: "192.168.137.1",
  }
) {
  return `from mqtt_as import MQTTClient, config
import uasyncio as asyncio
import comparator

cmp = comparator.Comparator()
automations = []

# Local configuration
config['ssid'] = '${network_config.ssid}'  # Optional on ESP8266
config['wifi_pw'] = '${network_config.pass}'
config['server'] = '${network_config.serverId}'  # Change to suit e.g. 'iot.eclipse.org'

def callback(topic, msg, retained, properties=None):
    asyncio.create_task(async_callback(topic, msg, retained))

async def async_callback(topic, msg, retained):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    result = {}

    if(msg.get('automation')):
        automation = {}
        automation = msg.copy()
        if(msg.get('interrupt')): #if peripheral is motion sensor or push button
            peripherals[automation["source"]].set_callback(make_mqtt_cb(automation))
            return
                
        automations.append(automation)
        return
     
    value = peripherals[msg['peripheral']][msg['method']][msg['param']]
    
    result['peripheral'] = msg['peripheral']
    result['method'] = msg['method']
    
    result['value'] = value
    result['status'] = True
    result['commandId'] = msg['commandId']

    await client.publish('esp32/${id}/sender', '{}'.format(json.dumps(result)), qos = 1)


async def conn_han(client):
    await client.subscribe('esp32/${id}/receiver', 1)
  
def on_change(peripheral_name, change):
    key, value = change
    print(peripheral_name, f' changed {key} to {value}')
    message = {} 
    message['peripheral'] = peripheral_name
    message['deviceId'] = ${id}
    message['change'] = change
    asyncio.create_task(publishMqtt('esp32/trigger', message))
    
async def publishMqtt(topic, objectMessage):
    await client.publish(topic, json.dumps(objectMessage), qos = 1)
    

    
async def main(client):
    await client.connect()

    # Start the automation loop in background
    asyncio.create_task(automation_loop())

    n = 0
    esp_status = {}
    esp_status['id'] = ${id}

    for x in peripherals:
        peripherals[x].watch_state(on_change)


    while True:
        await asyncio.sleep(1)
        
        esp_status['times'] = n

        print('publish', n)
        # If WiFi is down the following will pause for the duration.
        await asyncio.sleep(1)
        await client.publish('esp32/online', json.dumps(esp_status), qos = 1)
        n += 1

async def automation_loop():
    while True:
        await asyncio.sleep(1)  # Check every 1 second
        for automation in automations:
            try:
                await runAutomation(automation)
            except Exception as e:
                print("Automation error:", e)
                

async def publishMqttAutomation(outputDeviceId, outputMsg):
    await client.publish('esp32/{}/receiver'.format(outputDeviceId), json.dumps(outputMsg), qos = 1)
async def runAutomation(automation):
    global peripherals
    outputMsg = {}
    outputMsg['peripheral'] = automation['source-output']
    outputMsg['method'] = automation['method-output']
    outputMsg['param'] = automation['outputParams']
    outputMsg['commandId'] = 1
    
    outputDeviceId = automation['outputDeviceId']
    
    selectedPeripheral = automation['source']
    selectedMethod = automation['method']
    inputParams = automation['inputParams']
   
    if(automation['sourceOutputType'] == 'oled_display'):
        print('this is : ', automation['source-output'])
        outputMsg['param'] = ['{} , {}'.format(selectedPeripheral, peripherals[selectedPeripheral][selectedMethod][inputParams])]
        print(outputMsg['param'])
        await publishMqttAutomation(outputDeviceId, outputMsg)

    elif(automation['returnType'] == 'Number'):
        threshold = automation['threshold'] 
        if(cmp[automation['condition']][peripherals[selectedPeripheral][selectedMethod][inputParams], threshold]):
            await publishMqttAutomation(outputDeviceId, outputMsg)
    elif (automation['returnType'] == 'Boolean'):
        if(cmp['eq'][peripherals[selectedPeripheral][selectedMethod][inputParams], automation['condition']]):
            await publishMqttAutomation(outputDeviceId, outputMsg)
        
    print(outputMsg)

def make_mqtt_cb(automation):
    outputMsg = {}
    outputMsg['peripheral'] = automation['source-output']
    outputMsg['method'] = automation['method-output']
    outputMsg['param'] = automation['outputParams']
    outputMsg['commandId'] = 1
    output_device_id = automation['outputDeviceId']
    
    
    
    if outputMsg['param'] is None:
        outputMsg['param'] = []
    
    async def _job(level):
        global peripherals
        if(automation['sourceOutputType'] == 'oled_display'):
            print('this is : ', automation['source-output'])
            outputMsg['param'] = ['{} , {}'.format(automation['source'], level)]
            print(outputMsg['param'])
            await publishMqttAutomation(automation['outputDeviceId'], outputMsg)
            
        elif(automation['source-type'] == 'encoder'):
            print('message is sent with angle : ', level)
            outputMsg['param'] = [level] 
            await publishMqttAutomation(automation['outputDeviceId'], outputMsg)
            
        elif(automation['source-type'] in ['push_button', 'gas_sensor', 'motion_sensor']):
            if(level == automation['condition']):
                await publishMqttAutomation(automation['outputDeviceId'], outputMsg)
                
    # synchronous wrapper — **what you actually register**
    return lambda level: asyncio.create_task(_job(level))


config['subs_cb'] = callback
config['connect_coro'] = conn_han

MQTTClient.DEBUG = True  # Optional: print diagnostic messages
client = MQTTClient(config)
try:
    asyncio.run(main(client))
finally:
    client.close()  # Prevent LmacRxBlk:1 errors`;
}

function bootCode(ssid = "clear", pass = "13141516") {
  return `
import network

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("${ssid}", "${pass}")

while not wlan.isconnected():
    pass

print("Connected to Wi-Fi:", wlan.ifconfig())

  `;
}

async function codeGeneration(
  id,
  pDict,
  socket,
  network_config = {
    ssid: "clear",
    pass: "13141516",
    serverId: "192.168.137.1",
  }
) {
  try {
    socket.emit("processSetup", {
      status: "processing",
      data: "📥 Reading peripherals_info.json...",
    });

    // const allPeripherals = JSON.parse(
    //   fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
    // );

    socket.emit("processSetup", {
      status: "processing",
      data: "⚙️ Generating initialization code...",
    });
    const init_code = (await initializeCode(pDict)) + "\n";

    const pinsString = await seperatePins(init_code);

    const connectionPins = JSON.parse(pinsString);

    const query = { id };
    await Device.findOneAndUpdate(query, {
      connectionPins,
    });

    const mqtt_code = "\nimport json\n" + "\n" + mqtt_part2(id) + "\n";

    const main_code = init_code + "\n" + mqtt_code;
    socket.emit("processSetup", {
      status: "processing",
      data: "🧪 Generating methods/testing code...",
    });

    socket.emit("processSetup", {
      status: "processing",
      data: "💾 Writing main.py to espFiles...",
    });

    socket.emit("processSetup", {
      status: "processing",
      data: "📥 receiving main.py code📜",
      code: main_code,
      codeName: "main",
    });

    socket.emit("processSetup", {
      status: "processing",
      data: "📥 receiving boot.py code📜",
      code: bootCode(network_config.ssid, network_config.pass),
      codeName: "boot",
    });

    socket.emit("processSetup", {
      status: "processing",
      data: "✅ Code generation complete!",
      final: true,
    });
  } catch (err) {
    // No socket or console output, just rethrow
    console.log(err);
    throw err;
  }
}

module.exports = codeGeneration;
