const path = require("path");
const { getDevices } = require(path.join(__dirname, "./../data/devices"));
const mqtt = require("mqtt");
const fs = require("fs");
const pinsConnectionsGuide = require(path.join(
  __dirname,
  "./../esp32/aiPinConnection"
));

const displayDevicesSocket = async (socket) => {
  let selectedDeviceId;
  let onlineStatusInterval = {};
  let onlineDevices = [];
  let statusLog = [];
  const onlineDevicesSet = new Set();
  const pendingCommands = new Map(); // commandId -> ackCallBack
  const subscribedTopics = new Set();

  let devices = await getDevices();

  devices.forEach(
    (device) =>
      (device.dictList = Object.entries(device.dictVariables).map(
        ([key, val]) => key
      ))
  );
  const client = mqtt.connect("mqtt:localhost");

  client.on("connect", () => console.log("connected to the broker"));
  client.subscribe("esp32/online");
  client.subscribe("esp32/status");
  client.on("message", async (topic, message) => {
    // console.log(JSON.parse(message));
    if (topic === "esp32/online") {
      // console.log(JSON.parse(message));
      const deviceId = JSON.parse(message).id;
      // console.log("this is device id : ", deviceId);
      onlineDevicesSet.add(deviceId);
    } else {
      try {
        const response = JSON.parse(message.toString());
        const commandId = response.commandId;

        if (pendingCommands.has(commandId)) {
          const ack = pendingCommands.get(commandId);
          if (response.pins) {
            const guideArr = await pinsConnectionsGuide(response.pins);
            console.log("here is guide arr printed to file : ");
            fs.writeFileSync("./output.txt", JSON.stringify(guideArr));
            ack(guideArr); // Send response to front-end via WebSocket
          } else {
            ack(response); // Send response to front-end via WebSocket
          }
          pendingCommands.delete(commandId); // Clean up
        }
      } catch (err) {
        console.error("Invalid MQTT message:", err);
      }
    }
  });

  socket.on("fetchDevices", (data, ackCallBack) => {
    ackCallBack(devices);
    if (data === "all") {
      onlineStatusInterval = setInterval(() => {
        onlineDevices = [...new Set(statusLog)];
        statusLog = [];
        devices.forEach(
          (device) =>
            (device.status = onlineDevices.includes(device.id)
              ? "online"
              : "offline")
        );
        socket.emit("onlineDevices", [...onlineDevicesSet]);
      }, 3000);
    }
  });

  socket.on("deviceClick", async (data, ackCallBack) => {
    selectedDeviceId = data * 1;
    const device = devices.find((device) => device.id === data * 1);
    device.status = onlineDevicesSet.has(device.id);
    ackCallBack(device);
  });

  socket.on("getConnections", (deviceId, ackCallBack) => {
    // Do something with data...
    // get device id
    // console.log(deviceId);

    // publish mqtt message to device

    //client.publish(esp32/pins/receiver)
    //message.on(esp32/pins/sender)
    // the peripheral pins

    // build the prompt

    // call ai api
    // get the text
    // send the text
    const topic = `esp32/${deviceId}/sender`;

    if (!subscribedTopics.has(topic)) {
      client.subscribe(topic);
      subscribedTopics.add(topic);
    }
    const sendObject = {};
    sendObject.commandId = generateCommandId();
    sendObject.pins = 1;
    client.publish(`esp32/${deviceId}/receiver`, JSON.stringify(sendObject));
    pendingCommands.set(sendObject.commandId, ackCallBack);
  });

  socket.on("disconnect", () => {
    clearInterval(onlineStatusInterval);
    client.end();
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

module.exports = displayDevicesSocket;
