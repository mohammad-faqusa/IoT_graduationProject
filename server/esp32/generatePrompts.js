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

module.exports = {
  initializePeripheralsPrompt,
  methodsPrompt,
};
