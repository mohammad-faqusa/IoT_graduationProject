const fs = require("fs");
const path = require("path");

const callClaude = require("./claude_console/lib/index");

const peripherals_info = JSON.parse(fs.readFileSync("peripherals_info.json"));

let prompt = ` 
you are micropython esp32 code generator 
just write a python code to copy it directly on python file 'main.py'
I need to use the following peripherals : ${peripherals_info.map(
  (p) => p.name
)},

first import the class for each peripheral as following : 
${peripherals_info
  .map((p) => `from ${p.library_name} import ${p.class_name}`)
  .join("\n")}

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
      }(parameters...)`
  )
  .join("\n")}

  and don't write anything else. 

`;

let methodsPrompt = `
you are micropython esp32 code generator 

you need to write just micropyhton, to copy it directly on micropyhton file, 

I have dict of peripherals object in 'peripherals' dictionary micropython

and I need to use the methods of each peripheral for testing in (run_all_methods) function as following : 
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
fs.writeFileSync("prompt.txt", methodsPrompt);
fs.writeFileSync("methods_prompt.txt", prompt);
callClaude(prompt, path.join(__dirname, "espFiles/main.py"));
callClaude(methodsPrompt, path.join(__dirname, "espFiles/run_all_methods.py"));
