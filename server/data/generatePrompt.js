const fs = require("fs");

const peripherals_info = JSON.parse(fs.readFileSync("peripherals_info.json"));

console.log(peripherals_info.find((p) => p.name === "accelerometer"));

const accelerometer = JSON.stringify(
  peripherals_info.find((p) => p.name === "accelerometer"),
  null,
  2
);
fs.writeFileSync("prompt.txt", accelerometer);
