const path = require("path");
const { getDevices } = require(path.join(__dirname, "./../data/devices"));
const mqtt = require("mqtt");
const fs = require("fs");
const pinsConnectionsGuide = require(path.join(
  __dirname,
  "./../esp32/aiPinConnection"
));
const pList = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
).map((p) => p.name);

const Device = require("../models/Device.js");
const User = require("../models/User.js");

const espSetup = require("../esp32/espSetupElectron");

module.exports = async (
  socket,
  { getOnlineDevices, clientStatus, publishMessage, subscribeToTopic }
) => {
  console.log("✅ Electron socket fully authenticated:", socket.user);

  // ✅ Register event immediately, handle async data later
  socket.on("fetchDevices", async (data, ackCallback) => {
    try {
      console.log("📥 Received fetchDevices request:", data);
      let devices = await getDevices(socket.user.id);

      devices.forEach(
        (device) =>
          (device.dictList = Object.entries(device.dictVariables).map(
            ([key]) => key
          ))
      );

      ackCallback(devices); // ✅ Acknowledge
    } catch (err) {
      ackCallback({ error: "Failed to fetch devices" });
    }
  });

  socket.on("onlineDevices", async (data, ackCallBack) => {
    const mapAsObject = await getOnlineDevices(socket.user.id);
    console.log("this is online devices : ", mapAsObject);
    ackCallBack(mapAsObject);
  });

  socket.on("getConnections", async (deviceId, ackCallBack) => {
    console.log(deviceId);
    const device = await Device.findOne({ id: deviceId }).lean();
    const connectionPins = device.connectionPins;
    console.log(connectionPins);

    const arrGuide = await pinsConnectionsGuide(connectionPins);
    ackCallBack(arrGuide);
  });

  socket.on("addDevice", async (data, ackCallBack) => {
    try {
      // Optional: You can also use socket.user._id directly if JWT middleware includes it
      const userEmail = socket.user?.email;
      if (!userEmail) throw new Error("User not authenticated");

      const user = await User.findOne({ email: userEmail });
      if (!user) throw new Error("User not found");

      const peripherals = { ...data.peripherals };
      console.log(peripherals);

      const doc = new Device({
        name: data.name,
        location: data.location,
        dictVariables: peripherals,
        user: user._id, // associate device with the authenticated user
        image: data.picture || undefined, // optionally include image if provided
      });

      const device = await doc.save();
      ackCallBack(device._id);
    } catch (err) {
      ackCallBack(-1);
      console.error("Error in addDevice:", err);
    }
  });

  socket.on("setupDevice", async (data) => {
    console.log("recieved setupDevice data: ");
    console.log(data);
    const { network_config, deviceId } = data;
    network_config.serverId = "192.168.137.1";

    const device = await checkDeviceOwnership(socket, deviceId);
    socket.emit("deviceIndex", device.id);
    try {
      const pList = device.dictVariables;
      console.log("this is pList : ", pList);
      await espSetup(device.id, pList, socket, network_config);
    } catch (err) {
      await Device.findByIdAndDelete(device._id);
      socket.emit("errorSetup", {
        status: "error",
        data: `❌failed:", ${err.stderr || err.message}`,
      });
      socket.emit("errorSetup", {
        status: "finished",
        data: `the device is deleted from the database`,
      });
    }
  });

  // Your Electron app event handlers here

  const checkDeviceOwnership = async (socket, deviceId) => {
    if (!socket.user || !socket.user.id) {
      throw new Error("User not authenticated");
    }

    const device = await Device.findById(deviceId).lean();
    if (!device) {
      throw new Error("Device not found");
    }

    if (device.user.toString() !== socket.user.id.toString()) {
      throw new Error("Unauthorized: You do not own this device");
    }

    return device; // optionally return device for reuse
  };

  socket.on("addDevice_pList", async (data, ackCallBack) => {
    // const pList = (await Peripheral.find()).map(p => p.name);
    console.log("this is plist : ", pList);
    ackCallBack(pList);
  });
};
