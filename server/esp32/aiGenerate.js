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

function generateMethodPrompt(peripherals_info) {
  return `
you are micropython esp32 code generator 

you need to write just micropyhton, to copy it directly on micropyhton file, 

I have dict of peripherals object in 'peripherals' dictionary micropython

and I need to use the methods of each peripheral for testing in a written function, just write the body of function, and don't write the name of function 
consider writing try, except for each peripheral 
don't write function return 
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

function groupArrayElements(arr, groupSize) {
  const result = [];
  for (let i = 0; i < arr.length; i += groupSize) {
    result.push(arr.slice(i, i + groupSize));
  }
  return result;
}

async function methodsGeneration(peripherals_info) {
  const new_line_tapped_line = `
    `;
  const new_inner_line = `
            
        `;

  const grouped_peripherals_info = groupArrayElements(peripherals_info, 3);
  const arrCode = await Promise.all(
    grouped_peripherals_info.map(async (group_p, index) => {
      const prompt = generateMethodPrompt(group_p);
      fs.writeFileSync(`methods_prompt_${index}.txt`, prompt);
      const finalCode = await callClaude(prompt);
      // console.log(finalCode);
      return await finalCode;
    })
  );
  console.log(arrCode);
  const finalBody = arrCode.join("\n");
  const function_code = `
def run_all_methods():${new_line_tapped_line}${finalBody}`;

  fs.writeFileSync("test_all_methods.py", function_code);

  return;
}

methodsGeneration(peripherals_info);
