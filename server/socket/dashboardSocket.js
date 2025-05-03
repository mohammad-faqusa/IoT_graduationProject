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

  let devices = await getDevices();

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

  socket.on("devicesCards", (devicesCards, ackCallBack) => {
    Object.entries(devicesCards).forEach(async ([deviceName, peripherals]) => {
      if (!devicesCardsRes[deviceName]) {
        devicesCardsRes[deviceName] = {};
        componentsIds[deviceName] = {};
        devicesIds[deviceName] = devices.find(
          (device) => device.name === deviceName
        ).id;
        client.subscribe(`esp32/${devicesIds[deviceName]}/sender`);
        devicesCardsRes[deviceName] = peripherals;
      }
      const deviceId = devicesIds[deviceName];

      const selectedPDict = {};
      Object.entries(peripherals).forEach(([pName, pObj]) => {
        // console.log(pObj);

        selectedPDict[pName] = pObj.method;
        componentsIds[deviceName][pName] = pObj.componentId;
      });
      client.publish(
        `esp32/${deviceId}/receiver`,
        JSON.stringify(selectedPDict)
      );
    });

    ackCallBack(devicesCardsRes);
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
    sendObject.device = data.device;
    sendObject.peripheral = data.source;
    sendObject.method = data.method;
    if (!data.parameterLength) sendObject.param = [];
    else sendObject.param = autoParse(data.returnValue);
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
};

function autoParse(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(value) && value.trim() !== "") return Number(value);
  return value;
}

function generateCommandId() {
  return Date.now() + "-" + Math.random().toString(36).substring(2, 8);
}
module.exports = dashboardSocket;
