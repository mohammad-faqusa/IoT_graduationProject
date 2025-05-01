const { json } = require("express");
const Device = require("../models/Device");
const { getDevices } = require("./../data/devices");

const fs = require("fs");
const path = require("path");
const peripherals_info = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/peripherals_info.json"))
);
peripheral_methods = {};
peripherals_info.forEach(
  (peripheral) => (peripheral_methods[peripheral.name] = peripheral.methods)
);
// console.log(peripheral_methods);
const mqtt = require("mqtt");
// brokerConnectStatus

const dashboardVariables = {};
const devicesCardsRes = {};
const devicesIds = {};
const subscribedDevices = [];
const componentsIds = {};

dashboardSocket = async (socket) => {
  let devices = await getDevices();

  const client = mqtt.connect("mqtt:localhost");
  client.on("connect", () => console.log("connected to the broker"));

  client.on("message", (topic, message) => {
    const topicArr = topic.split("/");
    const messageObj = JSON.parse(message);
    console.log(messageObj);

    if (topicArr.at(2) === "sender") {
      const deviceName = devices.find(
        (device) => device.id === topicArr.at(1) * 1
      ).name;
      devicesCardsRes[deviceName] = {};
      Object.entries(messageObj).forEach(([pName, pValue]) => {
        devicesCardsRes[deviceName][pName] = {
          value: JSON.stringify(pValue),
          componentId: componentsIds[deviceName][pName],
        };
      });
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
    pObj = {};
    const sendObj = {};
    sendObj[device.peripheral] = {};
    if (device.value) {
      device.value = 1;
    } else {
      device.value = 0;
    }
    sendObj[device.peripheral][device.method] = device.value;
    console.log(sendObj);
    pObj[device.peripheral] = device.method;

    const deviceId = devices.find((dev) => dev.name === device.device).id;

    client.publish(`esp32/${deviceId}/receiver`, JSON.stringify(sendObj));
  });

  socket.on("fetchDevices", (data, ackCallBack) => {
    ackCallBack(devices);
  });

  socket.on("cardInterface", (data, ackCallBack) => {
    const selectedPeripheral = JSON.stringify(peripherals_info[data].methods);
    ackCallBack(selectedPeripheral);
  });

  socket.on("peripherals_methods", (data, ackCallback) => {
    ackCallback(peripheral_methods);
  });
};

module.exports = dashboardSocket;
