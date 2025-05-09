const fs = require("fs");
const path = require("path");
const {
  initializePeripheralsPrompt,
  methodsPrompt,
  generateMQTTCallbackPrompt,
  generateLoopReadPrompt,
} = require(path.join(__dirname, "generatePrompts"));

const callClaude = require(path.join(__dirname, "claude_console/lib/index"));

function groupArrayElements(arr, groupSize) {
  const result = [];
  for (let i = 0; i < arr.length; i += groupSize) {
    result.push(arr.slice(i, i + groupSize));
  }
  return result;
}

const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
);

async function initializeCode(peripherals_info) {
  const prompt = initializePeripheralsPrompt(peripherals_info);
  const finalCode = await callClaude(prompt);
  // fs.writeFileSync(path.join(__dirname, "espFiles/main.py"), finalCode);
  return finalCode;
}

async function testMethodsCode(peripherals_info) {
  const grouped_peripherals_info = groupArrayElements(peripherals_info, 3);
  const arrCode = await Promise.all(
    grouped_peripherals_info.map(async (group_p, index) => {
      const prompt = methodsPrompt(group_p);
      const finalBody = await callClaude(prompt);
      const finalCode = finalBody
        .split("\n")
        .map((line) => "    " + line)
        .join("\n");
      // console.log(finalCode);
      return await finalCode;
    })
  );
  const finalBody = arrCode.join("\n");
  const function_code = `
def run_all_methods(peripherals):\n${finalBody}`;

  // fs.writeFileSync("test_all_methods.py", function_code);

  return function_code;
}
async function generateLoopRead(peripherals_info) {
  const grouped_peripherals_info = groupArrayElements(peripherals_info, 3);
  const arrCode = await Promise.all(
    grouped_peripherals_info.map(async (group_p, index) => {
      const prompt = generateLoopReadPrompt(group_p);
      const finalBody = await callClaude(prompt);
      const finalCode = finalBody
        .split("\n")
        .map((line) => "    " + "    " + line)
        .join("\n");
      // console.log(finalCode);
      return await finalCode;
    })
  );
  const finalBody = arrCode.join("\n");
  const function_code = `def read_methods(peripherals):
    result = {}
    for peripheral_name, peripheral_obj in peripherals.items():\n${finalBody}\n${"    "}return result`;

  fs.writeFileSync("read_methods.py", function_code);

  return function_code;
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

    if(msg['pins']):
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
    // const read_methods_code = (await generateLoopRead(peripherals_info)) + "\n";

    const mqtt_code = "\nimport json\n" + "\n" + mqtt_part2(id) + "\n";

    const main_code = init_code + mqtt_code;
    socket.emit("processSetup", {
      status: "processing",
      data: "🧪 Generating methods/testing code...",
    });
    // const test_code = await testMethodsCode(peripherals_info);

    // const final_code = init_code + "\n" + test_code;

    socket.emit("processSetup", {
      status: "processing",
      data: "💾 Writing main.py to espFiles...",
    });

    const main_path = path.join(__dirname, "espFiles/main.py");
    const boot_path = path.join(__dirname, "espFiles/boot.py");

    // const test_methods_path = path.join(
    //   __dirname,
    //   "espFiles/test_all_methods.py"
    // );
    fs.writeFileSync(main_path, main_code);
    fs.writeFileSync(
      boot_path,
      bootCode(network_config.ssid, network_config.pass)
    );

    // fs.writeFileSync(test_methods_path, test_code);

    socket.emit("processSetup", {
      status: "processing",
      data: "✅ Code generation complete!",
    });

    // return final_code; // Optional, in case caller needs it
  } catch (err) {
    // No socket or console output, just rethrow
    console.log(err);
    throw err;
  }
}

module.exports = codeGeneration;
