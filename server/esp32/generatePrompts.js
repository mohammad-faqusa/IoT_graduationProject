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
      if msg contains a field for peripheral '${peripheral.name}', check if any of the following methods are specified under 'read_methods' or 'write_methods':
        ${JSON.stringify(peripheral.methods, null, 2)}

      If the peripheral contains 'read_methods', you should:
        - Call the method explicitly using: 'peripherals["${peripheral.name}"].methodName()'
        - Append the result to the 'output_dict', using this format:
          'output_dict["${peripheral.name}"]["methodName"] = result'

      If the peripheral contains 'write_methods', you should:
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

module.exports = {
  initializePeripheralsPrompt,
  methodsPrompt,
  generateMQTTCallbackPrompt,
};
