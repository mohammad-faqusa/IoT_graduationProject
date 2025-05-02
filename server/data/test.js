const fs = require("fs");

const peripherals_info = JSON.parse(fs.readFileSync("./peripherals_info.json"));

const peripheral_methods = {};
const read_methods_with_params = {};
const peripheral_read_methods = {};

peripherals_info.forEach((p) => {
  peripheral_methods[p.name] = p.methods;
  peripheral_read_methods[p.name] = {};

  Object.entries(p.methods).forEach(([name, body]) => {
    if (body.type == "read") peripheral_read_methods[p.name][name] = body;
  });
});

// console.log(read_methods);
console.log(read_methods_with_params);

fs.writeFileSync(
  "output.json",
  JSON.stringify(peripheral_read_methods, null, 2)
);
