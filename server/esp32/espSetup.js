const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const fs = require("fs");
const path = require("path");

// Replace with your actual port (or use "auto" if only one board is connected)
const port = "COM3";

// GitHub MIP package URLs

const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "peripherals_info.json"))
);

async function prepareESP32(socket) {
  try {
    socket.emit("processSetup", {
      status: "processing",
      data: "🔄 Resetting ESP32...",
    });
    console.log("🔄 Resetting ESP32...");

    await execPromise(`mpremote connect ${port} reset`);
    socket.emit("processSetup", {
      status: "processing",
      data: "✅ Board reset.",
    });
    console.log("✅ Board reset.");

    // Optional: wait for 2 seconds before next command
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (error) {
    console.log(`❌ Reset failed:", ${error.stderr || error.message}`);

    throw error;
  }
}

async function installLibraries(plist, socket) {
  console.log(peripherals_info[0]);
  const libraries = peripherals_info
    .filter((p) => plist.includes(p.name))
    .map((p) => [
      p.name,
      `github:mohammad0faqusa/mip-packages/${p.library_name}/package.json`,
    ]);
  libraries.push([
    "micropython-mqtt",
    `github:mohammad0faqusa/micropython-mqtt`,
  ]);
  for (const lib of libraries) {
    try {
      console.log(`📦 Installing ${lib[0]}...`);
      socket.emit("processSetup", {
        status: "processing",
        data: `📦 Installing ${lib[0]}...`,
      });
      const { stdout } = await execPromise(
        `mpremote connect ${port} mip install ${lib[1]}`
      );
      socket.emit("processSetup", {
        status: "processing",
        data: `✅ Installed:", ${stdout}`,
      });
      console.log("✅ Installed:", stdout);
    } catch (err) {
      console.error(
        `❌ Failed to install ${lib[0]}:`,
        err.stderr || err.message
      );
      throw err;
    }
  }
}

async function espSetup(id, plist, socket) {
  try {
    await prepareESP32(socket);
    await installLibraries(plist, socket);

    socket.emit("processSetup", {
      status: "finished",
      data: `the esp32 setup is finished successfully!`,
    });
  } catch (error) {
    console.log(error.stderr || error.message);
    socket.emit("errorSetup", {
      status: "error",
      data: `❌failed:", ${error.stderr || error.message}`,
    });
    throw error;
  }
}

// espSetup(0, ["acc"], "socket");
module.exports = espSetup;
