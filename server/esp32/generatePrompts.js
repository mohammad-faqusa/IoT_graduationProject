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
 * Build a prompt that makes the LLM output ONLY:
 *   1) import lines
 *   2) peripherals_pins dict
 *   3) peripherals dict with class instances
 *
 * Optional constructor parameters (optional === true OR a "default" key exists)
 * are deliberately **omitted**.
 *
 * @param {Object} dictVariables      // { instanceName : peripheralType, … }
 * @return {string} prompt
 */
function initializePeripheralsPrompt(dictVariables) {
  /* --------------------------------------------------------------------- */
  /*  0.  Build a quick lookup map:   typeName → info                      */
  /* --------------------------------------------------------------------- */
  const infoOf = {};
  peripherals_info.map((p) => (infoOf[p.name] = p));

  const instances = Object.entries(dictVariables); // [["acc", "accelerometer"], …]

  /* --------------------------------------------------------------------- */
  /*  1.  IMPORTS  (deduped per peripheral type)                           */
  /* --------------------------------------------------------------------- */
  const imports = [...new Set(instances.map(([, type]) => type))]
    .map((type) => {
      const meta = infoOf[type];
      if (!meta) return `# ⚠ unknown peripheral "${type}"`;
      return `from ${meta.library_name} import ${meta.class_name}`;
    })
    .join("\n");

  /* --------------------------------------------------------------------- */
  /*  2.  peripherals_pins  skeleton                                       */
  /*       – include ONLY *required* Pin-type ctor params                  */
  /* --------------------------------------------------------------------- */
  const pinDictLines = instances
    .map(([inst, type]) => {
      const meta = infoOf[type] || {};
      const reqPins = (meta.constructor?.parameters || [])
        .filter(
          (p) =>
            !p.optional && p.default === undefined && /pin/i.test(p.dataType)
        )
        .map((p) => `"${p.name}": …`)
        .join(", ");

      return reqPins ? `    "${inst}": { ${reqPins} },` : `    "${inst}": {},`;
    })
    .join("\n");

  /* --------------------------------------------------------------------- */
  /*  3.  peripherals  initialisation                                      */
  /*       – use required params only; map Pin params to peripherals_pins  */
  /* --------------------------------------------------------------------- */
  const initLines = instances
    .map(([inst, type]) => {
      const meta = infoOf[type] || {};
      const cls = meta.class_name || "UNKNOWN";

      const reqParams = (meta.constructor?.parameters || []).filter(
        (p) => !p.optional && p.default === undefined
      );

      const paramStr = reqParams
        .map((p) =>
          /pin/i.test(p.dataType)
            ? `${p.name}=peripherals_pins["${inst}"]["${p.name}"]`
            : `${p.name}=…`
        )
        .join(", ");

      return reqParams.length
        ? `peripherals["${inst}"] = ${cls}(${paramStr})`
        : `peripherals["${inst}"] = ${cls}()`;
    })
    .join("\n");

  /* --------------------------------------------------------------------- */
  /*  4.  Assemble final prompt – ultra-strict                             */
  /* --------------------------------------------------------------------- */
  return `
You are a MicroPython ESP32 **code generator**.

OUTPUT **ONLY** the Python between the markers.
• No Markdown fences
• No Wi-Fi, MQTT, asyncio, timers, or extra imports
• Keep comments EXACTLY as here (or omit them) – add nothing else.

### BEGIN CODE
${imports}

# Initialise pins dictionary
peripherals_pins = {
${pinDictLines}
}

# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
${initLines}
### END CODE
`;
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

function seperatePinsPrompt(pythonCode) {
  return `You are a code-analysis assistant.

**Task**
1. Read the Python code block below.
2. Find the dictionary assigned to the variable \`peripherals_pins\`.
3. Reply **only** with that dictionary in valid JSON (double-quoted keys/values, no comments, no Python syntax, no markdown, no back-ticks, no surrounding text).

**Input code**
\`\`\`python
${pythonCode}
`;
}
// console.log(generateLoopRead());

module.exports = {
  initializePeripheralsPrompt,
  generateDeviceWiringPrompt,
  seperatePinsPrompt,
};
