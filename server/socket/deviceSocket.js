// require('./../database.js')
const path = require("path");
const fs = require("fs");
const Device = require("../models/Device.js");
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
      const peripherals = {};
      data.peripherals.forEach((p) => {
        peripherals[p] = `value of ${p}`;
      });
      console.log(data.picture);
      console.log(data.pictureName);
      const doc = new Device({
        name: data.name,
        location: data.location,
        dictVariables: peripherals,
      });
      const device = await doc.save();
      ackCallBack(device.id);
    } catch (err) {
      socket.emit("errorSetup", err.message);
      console.log(err);
    }
  });

  socket.on("setupDevice", async (deviceId) => {
    const device = await Device.findOne({ id: deviceId });
    console.log("this is device : ", device);
    try {
      const pList = Array.from(device.dictVariables.keys());
      console.log("this is pList : ", pList);
      await espSetup(deviceId, pList, socket);
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
      const device = await Device.findOneAndDelete({ id: deviceId });

      ackCallBack(`the device: ${device._id} is deleted successfully`);
    } catch (err) {
      console.log(err);
      ackCallBack(`error in deleting the device, ${err.message}`);
    }
  });
};

module.exports = deviceSocket;
