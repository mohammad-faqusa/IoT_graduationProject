const fs = require("fs");
const path = require("path");
const { initializePeripheralsPrompt, methodsPrompt } = require(path.join(
  __dirname,
  "generatePrompts"
));

const callClaude = require(path.join(__dirname, "claude_console/lib/index"));

function groupArrayElements(arr, groupSize) {
  const result = [];
  for (let i = 0; i < arr.length; i += groupSize) {
    result.push(arr.slice(i, i + groupSize));
  }
  return result;
}

const peripherals_info = JSON.parse(fs.readFileSync("peripherals_info.json"));

async function initializeCode(peripherals_info) {
  const prompt = initializePeripheralsPrompt(peripherals_info);
  const finalCode = await callClaude(prompt);
  // fs.writeFileSync(path.join(__dirname, "espFiles/main.py"), finalCode);
  return finalCode;
}

async function methodsCode(peripherals_info) {
  const grouped_peripherals_info = groupArrayElements(peripherals_info, 3);
  const arrCode = await Promise.all(
    grouped_peripherals_info.map(async (group_p, index) => {
      const prompt = methodsPrompt(group_p);
      const finalCode = await callClaude(prompt, true);
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

async function codeGeneration(selectedPeripherals) {
  const peripherals_info = JSON.parse(
    fs.readFileSync("peripherals_info.json")
  ).filter((p) => selectedPeripherals.includes(p.name));

  const init_code = await initializeCode(peripherals_info);
  const test_code = await methodsCode(peripherals_info);

  const final_code = init_code + "\n" + test_code;
  fs.writeFileSync(path.join(__dirname, "espFiles/main.py"), final_code);
}

codeGeneration(["accelerometer", "dht_sensor", "internal_led"]);
// methodsCode(peripherals_info);
// initializeCode(peripherals_info);
