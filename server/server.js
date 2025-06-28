const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });
const http = require("http");
const mqtt = require("mqtt");

require("./database.js");

const socketio = require("socket.io");
const { Server } = require("socket.io");
const socketMain = require("./socket/socketMain");
const app = require("./app.js");
const server = http.createServer(app);

const port = process.env.PORT;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // change to your client origin
    credentials: true, // <-- allow cookies
  },
});

const { getDevices } = require(path.join(__dirname, "./data/devices"));

const pendingCommands = new Map(); // commandId -> ackCallBack
const subscribedTopics = new Set();
const onlineDevices = new Map();

const client = mqtt.connect("mqtt:localhost");

client.on("connect", () => {
  console.log("connected to the broker");
  subscribeToTopic("esp32/online");
});

client.on("message", (topic, message) => {
  try {
    if (topic === "esp32/online") {
      const deviceId = JSON.parse(message).id;
      const now = Date.now();
      onlineDevices.set(deviceId, now);
      return;
    }
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

function subscribeToTopic(topic) {
  if (!subscribedTopics.has(topic)) {
    client.subscribe(topic);
    subscribedTopics.add(topic);
  }
}

function publishMessage(topic, message, ack = () => {}) {
  // Subscribe only once per topic
  const commandId = generateCommandId();
  client.publish(topic, JSON.stringify({ commandId, ...message }));
  pendingCommands.set(commandId, ack);
}

function clientStatus() {
  return client.connected;
}

async function getOnlineDevices(userId) {
  const userDevices = [...(await getDevices(userId))].map(
    (device) => device.id
  );
  const userOnlineDevices = {};
  for (const deviceId of userDevices) {
    if (onlineDevices.has(deviceId)) {
      userOnlineDevices[deviceId] = onlineDevices.get(deviceId);
    }
  }
  return userOnlineDevices;
}

socketMain(io, {
  getOnlineDevices,
  clientStatus,
  publishMessage,
  subscribeToTopic,
});

server.listen(3000, () => console.log("Listening on 3000"));

function generateCommandId() {
  return Date.now() + "-" + Math.random().toString(36).substring(2, 8);
}
