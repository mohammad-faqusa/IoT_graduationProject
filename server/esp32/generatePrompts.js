function initializePeripheralsPrompt(peripherals_info) {
  return ` 
  you are micropython esp32 code generator 
  just write a python code to copy it directly on python file 'main.py'
  I need to use the following peripherals : ${peripherals_info.map(
    (p) => p.name
  )},
  
  first import the class for each peripheral as following : 
  ${peripherals_info
    .map((p) => `from ${p.library_name} import ${p.class_name}`)
    .join("\n")}
  
  initialize the 'peripherals_pins' dict, that take the peripheral name as key, and it's connected pins as dict value, it will be used later to know pin connection.
  then initialize each peripheral class as following, and store it in peripherals dict 'peripherals' : 

  ${peripherals_info
    .map(
      (p) =>
        `the class name for peripheral ${p.name} is ${
          p.class_name
        }, and the constructor parameters are : ${JSON.stringify(
          p.constructor.parameters
        )}
          and it is intialized like this : peripherals[${p.name}]=${
          p.class_name
        }(parameters...), consider the default values of parameters. 
        then insert the connected pins to 'peripherals_pins[${p.name}]'
  `
    )
    .join("\n")}
  
    and don't write anything else. 
  
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
