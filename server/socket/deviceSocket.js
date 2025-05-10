// require('./../database.js')
const path = require("path");
const fs = require("fs");
const Device = require("../models/Device.js");
const User = require("../models/User.js");

// const Peripheral = require('../models/Peripheral.js')
const espSetup = require("../esp32/espSetup");

const pList = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
).map((p) => p.name);

deviceSocket = (socket) => {
  socket.on("addDevice_pList", async (data, ackCallBack) => {
    // const pList = (await Peripheral.find()).map(p => p.name);
    console.log("this is plist : ", pList);
    ackCallBack(pList);
  });

  socket.on("addDevice", async (data, ackCallBack) => {
    try {
      // Optional: You can also use socket.user._id directly if JWT middleware includes it
      const userEmail = socket.user?.email;
      if (!userEmail) throw new Error("User not authenticated");

      const user = await User.findOne({ email: userEmail });
      if (!user) throw new Error("User not found");

      const peripherals = {};
      data.peripherals.forEach((p) => {
        peripherals[p] = `value of ${p}`;
      });

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

  socket.on("setupDevice", async (deviceId) => {
    await checkDeviceOwnership(socket, deviceId);
    const device = await Device.findById(deviceId);
    console.log("this is device : ", device);
    try {
      const pList = Array.from(device.dictVariables.keys());
      console.log("this is pList : ", pList);
      await espSetup(device.id, pList, socket);
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

  socket.on("deleteDevice", async (deviceId, ackCallBack) => {
    try {
      await checkDeviceOwnership(socket, deviceId);
      const device = await Device.findByIdAndDelete(deviceId);

      ackCallBack(`the device: ${device._id} is deleted successfully`);
    } catch (err) {
      console.log(err);
      ackCallBack(`error in deleting the device, ${err.message}`);
    }
  });
};

const checkDeviceOwnership = async (socket, deviceId) => {
  if (!socket.user || !socket.user.id) {
    throw new Error("User not authenticated");
  }

  const device = await Device.findById(deviceId);
  if (!device) {
    throw new Error("Device not found");
  }

  if (device.user.toString() !== socket.user.id.toString()) {
    throw new Error("Unauthorized: You do not own this device");
  }

  return device; // optionally return device for reuse
};

module.exports = deviceSocket;
