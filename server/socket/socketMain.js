const deviceSocket = require("./deviceSocket");
const devicesSocket = require("./devicesSocket");
const dashboardSocket = require("./dashboardSocket");
const electronSocket = require("./electronSocket");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const socketMain = async (io, mqttFunctions) => {
  // For default namespace and /dashboard (cookie-based)
  const browserJWTMiddleware = (socket, next) => {
    let token;
    const raw = socket.handshake.headers.cookie;
    if (raw) {
      const parsed = cookie.parse(raw);
      token = parsed.token;
    }
    if (!token) return next(new Error("Missing token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  };
  // Socket middleware to parse & verify your token cookie
  io.use(browserJWTMiddleware);
  io.of("/dashboard").use(browserJWTMiddleware);
  // ✅ Electron-specific JWT auth (auth.token)
  io.of("/electron").use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  // Default namespace
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected to default namespace:", socket.id);
    deviceSocket(socket);
    devicesSocket(socket);
  });

  // Dashboard namespace
  io.of("/dashboard").on("connection", (socket) => {
    console.log("📊 Socket connected to /dashboard:", socket.id);
    dashboardSocket(socket, mqttFunctions);
  });

  // ✅ Electron namespace
  io.of("/electron").on("connection", (socket) => {
    console.log("🖥️ Socket connected to /electron:", socket.user.email);
    electronSocket(socket); // <- Your Electron-specific logic
  });
};

module.exports = socketMain;
