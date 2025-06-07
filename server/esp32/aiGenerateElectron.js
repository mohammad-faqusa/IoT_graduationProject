const fs = require("fs");
const path = require("path");

const Device = require(path.join(__dirname, "./../models/Device"));

const { initializePeripheralsPrompt, seperatePinsPrompt } = require(path.join(
  __dirname,
  "generatePrompts"
));

const callClaude = require(path.join(__dirname, "claude_console/lib/index"));

async function initializeCode(peripherals_info) {
  const prompt = initializePeripheralsPrompt(peripherals_info);
  const finalCode = await callClaude(prompt);
  // fs.writeFileSync(path.join(__dirname, "espFiles/main.py"), finalCode);
  return finalCode;
}

async function seperatePins(pythonCode) {
  const prompt = seperatePinsPrompt(pythonCode);
  const pinsObject = await callClaude(prompt);

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
import asyncio

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
        automation = msg.copy();
        automations.append(automation)
        return

    if(msg.get('pins')):
        result['pins'] = peripherals_pins
        result['status'] = True
        result['commandId'] = msg['commandId']
        await client.publish('esp32/${id}/sender', '{}'.format(json.dumps(result)), qos = 1)
        print("this is pins")
        return  # ✅ Terminate early
     
    print("don't run here : "); 
    value = peripherals[msg['peripheral']][msg['method']][msg['param']]
    
    result['peripheral'] = msg['peripheral']
    result['method'] = msg['method']
    
    result['value'] = value
    result['status'] = True
    result['commandId'] = msg['commandId']

    await client.publish('esp32/${id}/sender', '{}'.format(json.dumps(result)), qos = 1)

async def conn_han(client):
    await client.subscribe('esp32/${id}/receiver', 1)
    
async def main(client):
    await client.connect()

    # Start the automation loop in background
    asyncio.create_task(automation_loop())

    n = 0
    esp_status = {}
    esp_status['id'] = ${id}

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
                

async def runAutomation(automation):
    outputMsg = {}
    outputMsg['peripheral'] = automation['source-output']
    outputMsg['method'] = automation['method-output']
    outputMsg['param'] = automation['outputParams']
    outputMsg['commandId'] = 1
    
    outputDeviceId = automation['outputDeviceId']

    if(automation['threshold']):
        selectedPeripheral = automation['source']
        selectedMethod = automation['method']
        inputParams = automation['inputParams']
        threshold = automation['threshold'] 
        if(automation['condition'] == 'gt'):
            if(peripherals[selectedPeripheral][selectedMethod][inputParams] > threshold):
                await client.publish('esp32/{}/receiver'.format(outputDeviceId), json.dumps(outputMsg), qos = 1)
        if(automation['condition'] == 'lt'):
            if(peripherals[selectedPeripheral][selectedMethod][inputParams] < threshold):
                await client.publish('esp32/{}/receiver'.format(outputDeviceId), json.dumps(outputMsg), qos = 1)
        if(automation['condition'] == 'eq'):
            if(peripherals[selectedPeripheral][selectedMethod][inputParams] == threshold):
                await client.publish('esp32/{}/receiver'.format(outputDeviceId), json.dumps(outputMsg), qos = 1)
    print(outputMsg)

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
  plist,
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

    const allPeripherals = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
    );

    const peripherals_info = allPeripherals.filter((p) =>
      plist.includes(p.name)
    );

    socket.emit("processSetup", {
      status: "processing",
      data: "⚙️ Generating initialization code...",
    });
    const init_code = (await initializeCode(peripherals_info)) + "\n";

    const pinsString = await seperatePins(init_code);

    const connectionPins = JSON.parse(pinsString);

    const query = { id };
    await Device.findOneAndUpdate(query, {
      connectionPins,
    });

    const mqtt_code = "\nimport json\n" + "\n" + mqtt_part2(id) + "\n";

    const main_code = init_code.pythonBlock + mqtt_code;
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
