function generatePeripheralPrompt(peripheralMap) {
  const peripheralList = Object.entries(peripheralMap)
    .map(([name, pin]) => `${name} (GPIO${pin})`)
    .join(", ");

  const pinInstructions = Object.entries(peripheralMap)
    .map(([name, pin]) => `- Connect the ${name} to GPIO${pin}`)
    .join("\n");

  return `Generate MicroPython code for an ESP32 project.  
The user will specify a list of peripheral devices with custom GPIO pins.  
Example peripherals: ${peripheralList}  

For each peripheral:
1. Assume there's a MicroPython library on GitHub (e.g., "github:user/peripheral_name").
2. Try importing the library with __import__(). If not found, install it using mip.install().
3. Import the module after installation.
4. Initialize the peripheral using the **specified GPIO pin**.
5. Write two functions per peripheral:
   - write() to control it (if applicable)
   - read() to read data from it
6. Function names must follow this format: [peripheral]_read(), [peripheral]_write()

⚠️ Do NOT include Wi-Fi or MQTT logic. Only hardware-level setup and control.  
⚙️ Code should be clean, modular, and easy to extend.

📌 At the end, include a short section titled "**Wiring Guide**" that explains how to physically connect each peripheral to the ESP32 using the provided GPIO pins:
${pinInstructions}`;
}

const peripherals = {
  led: 2,
  servo: 15,
  motion_sensor: 4,
  gas_sensor: 34,
};

const prompt = generatePeripheralPrompt(peripherals);
console.log(prompt);
