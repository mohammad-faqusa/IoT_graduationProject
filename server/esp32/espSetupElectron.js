const codeGeneration = require("./aiGenerateElectron");

async function espSetup(id, plist, socket, network_config) {
  console.log("this is plist from espSetup : ", plist);

  try {
    await codeGeneration(id, plist, socket, network_config);
  } catch (error) {
    console.log(error.stderr || error.message);
    socket.emit("errorSetup", {
      status: "error",
      data: `❌failed:", ${error.stderr || error.message}`,
    });
    throw error;
  }
}

module.exports = espSetup;
