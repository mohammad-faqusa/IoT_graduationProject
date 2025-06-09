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

  const pendingCommands = new Map(); // commandId -> ackCallBack

  const client = mqtt.connect("mqtt:localhost");
  client.on("connect", () => console.log("connected to the broker"));

  client.on("message", (topic, message) => {
    try {
      console.log(message);
      const response = JSON.parse(message.toString());
      const commandId = response.commandId;

      if (pendingCommands.has(commandId)) {
        const ack = pendingCommands.get(commandId);
        ack(response); // Send response to front-end via WebSocket
        pendingCommands.delete(commandId); // Clean up
      }
    } catch (err) {
      console.error("Invalid MQTT message:", err);
    }
  });

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

    client.publish(`esp32/${deviceId}/receiver`, JSON.stringify(device));
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

    if (methodInfo.type === "write")
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

    const topic = `esp32/${deviceId}/sender`;

    // Subscribe only once per topic
    if (!subscribedTopics.has(topic)) {
      client.subscribe(topic);
      subscribedTopics.add(topic);
    }

    client.publish(`esp32/${deviceId}/receiver`, JSON.stringify(sendObject));
    pendingCommands.set(sendObject.commandId, ackCallBack);
  });

  socket.on("addAutomationRule", (data) => {
    try {
      data.automation = 1;
      const sourceType = data.source.split(",")[1];
      const returnType =
        peripherals_interface_info[sourceType].methods[data.method].returns
          ?.dataType;

      if (returnType) data.returnType = returnType;

      console.log(data);

      data.source = data.source.split(",")[0];
      data.condition = autoParse(data.condition);

      data["source-output"] = data["source-output"].split(",")[0];

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
