const fs = require("fs");

const peripherals_info = JSON.parse(fs.readFileSync("peripherals_info.json"));

const p_names = peripherals_info.map((p) => {
  // library: p.library_name,
  // class: p.class_name,
  return `from ${p.library_name} import ${p.class_name}`;
});

// console.log(p_names);

fs.writeFileSync("temp_output.py", p_names.join("\n"));
