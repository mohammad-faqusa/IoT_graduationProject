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

function methodsPrompt(peripherals_info) {
  return `
  you are micropython esp32 code generator 
  
  you need to write just micropyhton, to copy it directly on micropyhton file, 
  
  I have dict of peripherals object in 'peripherals' dictionary micropython
  
  and I need to use the methods of each peripheral for testing in a written function, just write the body of function, and don't write the name of function 
  consider writing try, except for each peripheral 
  don't write function return 
  import any mip package if required, write code if library not imported, then import it 
  and write the methods as following  : 
  ${peripherals_info.map(
    (p) => `for peripheral ${p.name}, the object of ${
      p.class_name
    }, which is stored in 'peripherals[${
      p.name
    }]', run it's methods as following : 
      ${Object.entries(p.methods)
        .map(
          ([name, body]) =>
            `the properties of method ${name}, as following : ${JSON.stringify(
              body,
              null,
              2
            )}`
        )
        .join("\n\t")}}`
  )}
  `;
}

// prettier-ignore
function generateMQTTCallbackPrompt(peripherals_info) {
  // prettier-ignore
  return `
  You are a MicroPython generator. Your task is to write the body of the 'callback' function, which processes MQTT messages. The general format of the function is:

    def callback(topic, msg, retained, properties=None):  # MQTT V5 passes properties
      print((topic.decode(), msg.decode(), retained))

  Please **do not** write the callback function's title or signature. Just write the body of the callback function, following these constraints:

  ### Do not:
  1. Write the title of the callback function (i.e., "def callback(...)").
  2. Write or use a try-catch block.
  3. Initialize the \`output_dict\` variable. It is already initialized outside of this function, so do not reinitialize it (e.g., \`output_dict = {}\`).
  4. Call the \`send_message(output_dict)\` function at the end of the callback. This is handled elsewhere.
  5. Decode or parse the \`topic\` or \`msg\` variables. These have already been handled elsewhere and are ready for use.
  6. Iterate through the \`msg\` object. Instead, use explicit checks like \`if "peripheral_name" in msg\` to handle individual fields.
  7. Reinitialize or overwrite the \`output_dict\` for each peripheral. If you need to add data to it, modify the existing dictionary (e.g., \`output_dict["peripheral_name"]["method_name"] = value\`).
  8. write the line \`print((topic, msg, retained))\`. This has already been handled by the framework.
  
  The MQTT client is already subscribed to the relevant topic, so no need to filter messages based on the topic.

  The \`msg\` dictionary will contain the fields that correspond to one or more peripherals. Each peripheral may have methods categorized as \`read_methods\` or \`write_methods\`. The structure for each peripheral is as follows:

    ${peripherals_info.map(peripheral => `
      if msg contains a field for peripheral '${peripheral.name}', you can specify the read or write methods according to type of function written inside properties of methods as following : 
        ${JSON.stringify(peripheral.methods, null, 2)}
      first initialize \`output_dict["${peripheral.name}"]\` = {} 
      If the peripheral contains read method, you should:
        - Call the method explicitly using: 'peripherals["${peripheral.name}"].methodName()'
        - Append the result to the 'output_dict', using this format:
          'output_dict["${peripheral.name}"]["methodName"] = result'

      If the peripheral contains write , you should:
        - Call the write method explicitly using: 'peripherals["${peripheral.name}"].methodName()'
        - Append the result to 'output_dict' with a status like:
          'output_dict["${peripheral.name}"]["methodName"] = {"status": "ok"}'

      You should **not** iterate over the methods but call them explicitly by name.
    `).join("\n")}

  Output:
    - For 'read_methods', you must append the return value to 'output_dict' in the format:
      'output_dict["peripheral_name"]["method_name"] = return_value'
    - For 'write_methods', append the status to 'output_dict' in the format:
      'output_dict["peripheral_name"]["method_name"] = {"status": "ok"}'`
}

function generateLoopReadPrompt(peripherals_info) {
  return `
  You are a MicroPython generator. Your task is write a function that loop through peripherals objects stored in 'peripherals' dict, 
  to run the 'read' type methods.
  **Consider:
  1.The variable 'result' is previously written to save the value of what returned from read methods. 
  **Do:
  1.Just write the body of the function
  2.write try except for each method, and the except will store the error
  ### Do not:
  1. write the name of the function 
  2. write the return of the function
  3. do not initialize 'result' variable, becuase it is perivously initialized
  4. write the loop, becuase the code is written inside the loop 'for peripheral_name, peripheral_obj in peripherals.items():'

  as following for each peripheral : 
    ${peripherals_info.map(
      (p) => `
      for peripheral ${
        p.name
      }, here are the properties of read methods : ${JSON.stringify(
        Object.entries(p.methods).filter(
          ([method_name, method_body]) => method_body.type === "read"
        )
      )}
      `
    )}

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
// console.log(generateLoopRead());

module.exports = {
  initializePeripheralsPrompt,
  methodsPrompt,
  generateMQTTCallbackPrompt,
  generateLoopReadPrompt,
  generateDeviceWiringPrompt,
};
