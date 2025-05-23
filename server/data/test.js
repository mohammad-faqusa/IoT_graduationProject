const fs = require("fs");

const peripherals_info = JSON.parse(
  fs.readFileSync("./peripherals_info.json"),
  null,
  2
);
const peripherals_read_methods = JSON.parse(
  fs.readFileSync("./read_methods.json")
);

const peripherals_info_2 = peripherals_info.map((p) => ({
  ...p,
  methods: { ...p.methods, ...peripherals_read_methods[p.name] },
}));

fs.writeFileSync(
  "./peripherals_info_2.json",
  JSON.stringify(peripherals_info_2, null, 2)
);
