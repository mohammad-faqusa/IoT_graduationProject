const path = require("path");
const { getDevices } = require(path.join(__dirname, "./../data/devices"));
const mqtt = require("mqtt");
const pinsConnectionsGuide = require(path.join(
  __dirname,
  "./../esp32/aiPinConnection"
));
const Device = require("../models/Device.js");
const User = require("../models/User.js");

module.exports = async (socket) => {
  console.log("✅ Electron socket fully authenticated:", socket.user);
  const onlineDevices = new Map();
  const subscribedTopics = new Set();
  const pendingCommands = new Map(); // commandId -> ackCallBack

  const client = mqtt.connect("mqtt:localhost");
  client.subscribe("esp32/online");
  client.subscribe("esp32/status");
  client.on("message", async (topic, message) => {
    // console.log(JSON.parse(message));
    if (topic === "esp32/online") {
      // console.log(JSON.parse(message));
      const deviceId = JSON.parse(message).id;
      // console.log("this is device id : ", deviceId);
      console.log("online esp32 : ", deviceId);

      const now = Date.now();
      onlineDevices.set(deviceId, now);
    } else {
      try {
        const response = JSON.parse(message.toString());

        console.log("this is the response : ", response);
        const commandId = response.commandId;

        console.log(pendingCommands);
        if (pendingCommands.has(commandId)) {
          const ack = pendingCommands.get(commandId);

          console.log("this is reponse pins : ", response.pins);
          if (response.pins) {
            const guideArr = await pinsConnectionsGuide(response.pins);

            console.log("this is guide arr ", guideArr);
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

  socket.on("ping", () => {
    console.log("Received ping from Electron");
    socket.emit("pong");
  });

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

  socket.on("onlineDevices", (data, ackCallBack) => {
    const mapAsObject = Object.fromEntries(onlineDevices);
    console.log("this is online devices : ", mapAsObject);
    ackCallBack(mapAsObject);
  });

  socket.on("getConnections", (deviceId, ackCallBack) => {
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

  // Your Electron app event handlers here
};

function generateCommandId() {
  return Date.now() + "-" + Math.random().toString(36).substring(2, 8);
}
