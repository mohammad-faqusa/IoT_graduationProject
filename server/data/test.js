const fs = require("fs");

const peripherals_info = JSON.parse(fs.readFileSync("./peripherals_info.json"));

const peripheral_methods = {};
const read_methods_with_params = {};
const peripheral_read_methods = {};
const peripheral_write_methods = {};
const peripheral_write_methods_no_parameters = {};

peripherals_info.forEach((p) => {
  peripheral_methods[p.name] = p.methods;
  peripheral_read_methods[p.name] = {};
  peripheral_write_methods[p.name] = {};
  peripheral_write_methods_no_parameters[p.name] = {};

  Object.entries(p.methods).forEach(([name, body]) => {
    if (body.type == "read") peripheral_read_methods[p.name][name] = body;
    if (body.type == "write") peripheral_write_methods[p.name][name] = body;
    if (body.type == "write" && !body.parameters)
      peripheral_write_methods_no_parameters[p.name][name] = body;
  });
});

// console.log(read_methods);
console.log(read_methods_with_params);

fs.writeFileSync(
  "read_methods.json",
  JSON.stringify(peripheral_read_methods, null, 2)
);
fs.writeFileSync(
  "write_methods.json",
  JSON.stringify(peripheral_write_methods, null, 2)
);
fs.writeFileSync(
  "write_methods_no_parameters.json",
  JSON.stringify(peripheral_write_methods_no_parameters, null, 2)
);
