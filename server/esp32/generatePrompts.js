// function initializePeripheralsPrompt(dictVariables, peripherals_info) {
//   return `
//   you are micropython esp32 code generator
//   just write a python code to copy it directly on python file 'main.py'
//   I need to use the following peripherals : ${peripherals_info.map(
//     (p) => p.name
//   )},

//   first import the class for each peripheral as following :
//   ${peripherals_info
//     .map((p) => `from ${p.library_name} import ${p.class_name}`)
//     .join("\n")}

//   initialize the 'peripherals_pins' dict, that take the peripheral name as key, and it's connected pins as dict value, it will be used later to know pin connection.
//   then initialize each peripheral class as following, and store it in peripherals dict 'peripherals' :

//   ${peripherals_info
//     .map(
//       (p) =>
//         `the class name for peripheral ${p.name} is ${
//           p.class_name
//         }, and the constructor parameters are : ${JSON.stringify(
//           p.constructor.parameters
//         )}
//           and it is intialized like this : peripherals[${p.name}]=${
//           p.class_name
//         }(parameters...), consider the default values of parameters.
//         then insert the connected pins to 'peripherals_pins[${p.name}]'
//   `
//     )
//     .join("\n")}

//     and don't write anything else.

//   `;
// }

const fs = require("fs");
const path = require("path");

const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
);

/**
 * Convert peripherals_info (array) → dict keyed by .name
 * so we can do O(1) look-ups later.
 */
const peripheralsByName = Object.fromEntries(
  peripherals_info.map((p) => [p.name, p])
);

/**
 * Build the prompt that will make ChatGPT output
 *    peripherals = {}
 *    peripherals["foo"] = Foo(...)
 * --nothing else, no generic GPIO/I²C scaffolding.
 */
function initializePeripheralsPrompt(dictVariables) {
  // -------- 1. Resolve & validate the peripherals -------------
  const sources_info = Object.fromEntries(
    Object.entries(dictVariables)
      .map(([alias, id]) => [alias, peripheralsByName[id]])
      .filter(([, obj]) => obj) // drop unknown IDs
  );

  // -------- 2. Build instruction lines for each peripheral ----
  const periphHints = Object.entries(sources_info)
    .map(
      ([alias, p]) => `
• peripheral alias **"${alias}"**  
  • class      : \`${p.class_name}\`  
  • module     : \`${p.library_name}\`  
  • REQUIRED constructor params (primitive only, NO optional params):  
    ${JSON.stringify(p.constructor)}
  • After the instantiation line add a **single** inline comment listing the GPIOs used.`
    )
    .join("\n");

  // -------- 3. Final prompt -----------------------------------
  return `
You are an **ESP32 MicroPython code generator**.

### Task
Generate only the MicroPython code that:
1. Creates an empty dictionary called \`peripherals\`.
2. Instantiates each peripheral listed below **exactly once**, using its class from the indicated module, **only with the required primitive constructor arguments**.
3. Stores every instance in \`peripherals["<alias>"]\`.
4. Adds a brief inline GPIO-pin comment **on the same line** as each instantiation.
5. Outputs nothing else—no extra GPIO/I²C/SPI setup, no Wi-Fi, no explanations.

### Peripherals to instantiate
${periphHints}

### Output-format example  (NOT part of your final answer; for clarity only)
\`\`\`python
# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
peripherals["ultra sonic"]  = UltrasonicSensor(5, 18)   # TRIG=5, ECHO=18
peripherals["internal led"] = InternalLED()             # GPIO2
peripherals["oled display"] = OLED()                    # SDA=21, SCL=22
\`\`\`

**Remember**:  
* Use primitive literals (e.g. \`13\`, not \`Pin(13)\`).  
* Do **not** include peripherals that are not listed.  
* Do **not** add boiler-plate (I²C, SPI, Wi-Fi, MQTT, etc.).  
Return the code block only.`;
}

function generateDeviceWiringPrompt(deviceName, pinsConnection, pinProperties) {
  const prettyJSON = (obj) => JSON.stringify(obj, null, 2);

  return `
You are working with an **ESP32-WROOM-32** microcontroller and the following peripheral device: **"${deviceName}"**

Partial pin connections for the device:
\`\`\`json
${prettyJSON({ [deviceName]: pinsConnection })}
\`\`\`

All known pin properties of the device:
\`\`\`json
${prettyJSON(pinProperties)}
\`\`\`

🔧 Your task:
Generate a complete list of step-by-step instructions for wiring the **"${deviceName}"** to an ESP32-WROOM-32 board.

📌 Rules & Tips:
- **Preserve** all existing connections.
- Use valid GPIO pins on the ESP32 (0–39). Avoid GPIOs 6–11 (used for flash) and GPIOs 34–39 (input-only).
- Assign safe and common GPIO defaults to unassigned required pins.
- Power pins (like VCC) should be connected to 3.3V unless specified otherwise.
- Optional pins can be connected if helpful, or left unconnected with a brief explanation.
- Do not include any JSON — just plain-text steps.

✅ Output format (example):
1. Connect VCC to 3.3V output of ESP32.
2. Connect GND to GND pin on ESP32.
3. Connect SDA to GPIO 21 (already assigned).
4. Connect SCL to GPIO 22 (already assigned).
5. Leave INT unconnected unless motion detection interrupt is needed.
6. Pull AD0 to GND to select I2C address 0x68.

Provide the steps in plain text format only.
  `.trim();
}

function seperatePinsPrompt(initCode) {
  return `
You are an **ESP32 pin-extractor**.

### Task
Read the MicroPython initialisation code in the block below and build a JSON
object that lists the GPIO pins used by each peripheral.

### Output
* Return **only** a JSON object under the top-level key \`"connection_pins"\`.
* Example format (**illustrative only**):

\`\`\`json
{
  "connection_pins": {
    "accelerometer": { "sda": 21, "scl": 22 },
    "encoder":       { "pin_a": 12, "pin_b": 14 },
    "relay 1":       { "pin": 26 }
  }
}
\`\`\`

### Extraction rules
1. Use the alias that appears inside \`peripherals["..."]\` as the object key.
2. Take **all pin numbers exclusively from the inline comment** on the same line
   (the text after \`#\`).
   * If the comment contains pairs like \`NAME=NUM\`, use \`NAME\` (lower-case).
   * If it lists bare \`GPIO<num>\` values, create keys \`pin1\`, \`pin2\`, … in
     the order they appear.
3. Ignore non-numeric constructor arguments (e.g. \`True\`, \`False\`, angles).
4. Output *nothing except* the fenced JSON code block.

### Code block
\`\`\`python
${initCode}
\`\`\`
`;
}

// console.log(generateLoopRead());

module.exports = {
  initializePeripheralsPrompt,
  generateDeviceWiringPrompt,
  seperatePinsPrompt,
};
