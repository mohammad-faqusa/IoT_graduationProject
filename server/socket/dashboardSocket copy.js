const { json } = require("express");
const Device = require("../models/Device");
const { getDevices } = require("./../data/devices");

const fs = require("fs");
const path = require("path");
peripherals_interface_info = {};

const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
);
peripheral_methods = {};

peripherals_info.forEach((peripheral) => {
  peripheral_methods[peripheral.name] = peripheral.methods;
  peripherals_interface_info[peripheral.name] = {};
  peripherals_interface_info[peripheral.name].title = peripheral.title;
  peripherals_interface_info[peripheral.name].methods = peripheral.methods;
});

const mqtt = require("mqtt");

dashboardSocket = async (socket) => {
  const subscribedTopics = new Set();

  let devices = await getDevices(socket.user.id);

  socket.on("brokerStatus", (data, ackCallBack) => {
    ackCallBack(client.connected);
  });

  socket.on("deviceCardControl", (device) => {
    console.log(device);

    device.param = [device.value];
    if (device.value) {
      device.value = 1;
    } else {
      device.value = 0;
    }
    device.param = [device.value];

    const deviceId = devices.find((dev) => dev.name === device.device).id;
  });

  socket.on("fetchDevices", (data, ackCallBack) => {
    ackCallBack(devices);
  });

  socket.on("cardInterface", (data, ackCallBack) => {
    const selectedPeripheral = JSON.stringify(peripherals_info[data].methods);
    ackCallBack(selectedPeripheral);
  });

  socket.on("peripherals_interface_info", (data, ackCallback) => {
    ackCallback(peripherals_interface_info);
  });

  socket.on("immediateCommand", (data, ackCallBack) => {
    sendObject = {};
    const deviceId = devices.find((dev) => dev.name === data.device).id;
    const sourceArr = data.source.split(",");
    const source = sourceArr[0];
    const sourceType = sourceArr[1];

    sendObject.device = data.device;
    sendObject.peripheral = source;
    sendObject.method = data.method;

    const methodInfo =
      peripherals_interface_info[sourceType].methods[data.method];
    const params = methodInfo.parameters;

    if (methodInfo.type === "write" && methodInfo.parameters)
      sendObject.param = [autoParse(data.returnValue)];
    else {
      if (!params || !data.parameterLength) sendObject.param = [];
      else if (
        typeof params[0].default === "undefined" ||
        params[0].default === null
      ) {
        sendObject.param = [];
      } else sendObject.param = [autoParse(data.returnValue)];
    }

    console.log("this is send object : ", sendObject);
    sendObject.commandId = generateCommandId();

    client.publish(`esp32/${deviceId}/receiver`, JSON.stringify(sendObject));
  });

  socket.on("addAutomationRule", (data) => {
    try {
      data.automation = 1;
      const sourceType = data.source.split(",")[1];
      const methodInfo =
        peripherals_interface_info[sourceType].methods[data.method];
      data["source-type"] = sourceType;
      const returnType = methodInfo.returns?.dataType;

      if (methodInfo.interrupt) data.interrupt = true;
      if (returnType) data.returnType = returnType;

      console.log(data);

      data.source = data.source.split(",")[0];
      data["method-output"] = data["method-output"].split(",")[1];
      if (data.condition) data.condition = autoParse(data.condition);

      data["source-output"] = data["source-output"].split(",");
      data.sourceOutputType = data["source-output"][1];
      data["source-output"] = data["source-output"][0];

      console.log("this is source output type ", data["source-output-type"]);
      const inputDevice = devices.find((dev) => dev.name === data.device);

      const outputDevice = devices.find(
        (dev) => dev.name === data["device-output"]
      );

      console.log("this is output device : ", outputDevice);

      data.outputDeviceId = Number(outputDevice.id);
      data.outputParams = [];
      data.inputParams = [];

      if (data["automation-result-value"]) {
        data.outputParams.push(autoParse(data["automation-result-value"]));
      }
      if (data.threshold) {
        data.threshold = autoParse(data.threshold);
      }

      console.log("send data to esp32 : ");
      console.log(data);

      client.publish(`esp32/${inputDevice.id}/receiver`, JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  });
};

function autoParse(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(value) && value?.trim() !== "") return Number(value);
  return value;
}

function generateCommandId() {
  return Date.now() + "-" + Math.random().toString(36).substring(2, 8);
}
module.exports = dashboardSocket;
