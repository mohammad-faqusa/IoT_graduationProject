const fs = require("fs");
const path = require("path");
const {
  initializePeripheralsPrompt,
  methodsPrompt,
  generateMQTTCallbackPrompt,
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
async function mqttCallbackCode(peripherals_info) {
  const grouped_peripherals_info = groupArrayElements(peripherals_info, 3);
  const arrCode = await Promise.all(
    grouped_peripherals_info.map(async (group_p, index) => {
      const prompt = generateMQTTCallbackPrompt(group_p);
      const finalCode = await callClaude(prompt);

      console.log(finalCode);
      return await finalCode;
    })
  );
  const function_header = `def callback(topic, msg, retained, properties=None):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    output_dict = {}`;
  arrCode[arrCode.length - 1] =
    arrCode[arrCode.length - 1] +
    "\n" +
    "# Run the async sender from sync context\nasyncio.create_task(send_message(output_dict))";
  const function_code =
    function_header +
    "\n" +
    arrCode
      .join("\n")
      .split("\n")
      .map((line) => "    " + line)
      .join("\n");
  fs.writeFileSync(path.join(__dirname, "espFiles/main.py"), function_code);
  return function_code;
}

async function testMethodsCode(peripherals_info) {
  const grouped_peripherals_info = groupArrayElements(peripherals_info, 3);
  const arrCode = await Promise.all(
    grouped_peripherals_info.map(async (group_p, index) => {
      const prompt = methodsPrompt(group_p);
      const finalBody = await callClaude(prompt);
      const finalCode = finalCode
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

async function codeGeneration(selectedPeripherals, socket) {
  try {
    socket.emit("processSetup", {
      status: "processing",
      data: "📥 Reading peripherals_info.json...",
    });

    const allPeripherals = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
    );

    const peripherals_info = allPeripherals.filter((p) =>
      selectedPeripherals.includes(p.name)
    );

    socket.emit("processSetup", {
      status: "processing",
      data: "⚙️ Generating initialization code...",
    });
    const init_code = await initializeCode(peripherals_info);

    socket.emit("processSetup", {
      status: "processing",
      data: "🧪 Generating methods/testing code...",
    });
    const test_code = await testMethodsCode(peripherals_info);

    // const final_code = init_code + "\n" + test_code;

    socket.emit("processSetup", {
      status: "processing",
      data: "💾 Writing main.py to espFiles...",
    });

    const init_path = path.join(__dirname, "espFiles/main.py");
    const test_methods_path = path.join(
      __dirname,
      "espFiles/test_all_methods.py"
    );
    fs.writeFileSync(init_path, init_code);
    fs.writeFileSync(test_methods_path, test_code);

    socket.emit("processSetup", {
      status: "processing",
      data: "✅ Code generation complete!",
    });

    // return final_code; // Optional, in case caller needs it
  } catch (err) {
    // No socket or console output, just rethrow
    throw err;
  }
}

mqttCallbackCode(peripherals_info);
// module.exports = codeGeneration;
