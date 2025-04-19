const fs = require("fs");

const callClaude = require("./../claude_console/lib/index");

const peripherals_info = JSON.parse(fs.readFileSync("peripherals_info.json"));

console.log(peripherals_info[0]);

let prompt = ` 
you are micropython esp32 code generator 
I need to use the following peripherals : ${peripherals_info.map(
  (p) => p.name
)},

first import the class for each peripheral as following : 
${peripherals_info
  .map((p) => `from ${p.library_name} import ${p.class_name}`)
  .join("\n")}

then initialize each peripheral class as following : 

${peripherals_info
  .map(
    (p) =>
      `the class name for peripheral ${p.name} is ${
        p.class_name
      }, and the constructor parameters are : ${JSON.stringify(
        p.constructor.parameters
      )}`
  )
  .join("\n")}
`;
callClaude(prompt);
