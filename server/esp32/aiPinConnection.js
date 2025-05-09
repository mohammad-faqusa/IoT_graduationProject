const path = require("path");
const fs = require("fs");

const { generateDeviceWiringPrompt } = require(path.join(
  __dirname,
  "generatePrompts"
));

const callClaude = require(path.join(__dirname, "claude_console/lib/index"));
const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
);

async function pinsConnectionsGuide(pins_dict) {
  selectedPeripheralsInfo = {};
  Object.keys(pins_dict).forEach(
    (peripheral_name) =>
      (selectedPeripheralsInfo[peripheral_name] = peripherals_info.find(
        (p) => p.name === peripheral_name
      ))
  );
  const arrGuide = await Promise.all(
    Object.entries(pins_dict).map(async ([peripheral_name, pins]) => {
      const prompt = generateDeviceWiringPrompt(
        peripheral_name,
        pins,
        selectedPeripheralsInfo[peripheral_name]
      );
      const finalBody = await callClaude(prompt);
      return await finalBody;
    })
  );

  return arrGuide;
}

module.exports = pinsConnectionsGuide;
