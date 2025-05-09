const { getDevices } = require("./../data/devices");
const mqtt = require("mqtt");

const displayDevicesSocket = async (socket) => {
  let selectedDeviceId;
  let onlineStatusInterval = {};
  let onlineDevices = [];
  let statusLog = [];
  const onlineDevicesSet = new Set();

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
  client.on("message", (topic, message) => {
    // console.log(JSON.parse(message));
    if (topic === "esp32/online") {
      console.log(JSON.parse(message));
      const deviceId = JSON.parse(message).id;
      console.log("this is device id : ", deviceId);
      onlineDevicesSet.add(deviceId);
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

  socket.on("disconnect", () => {
    clearInterval(onlineStatusInterval);
    client.end();
  });
};

module.exports = displayDevicesSocket;
