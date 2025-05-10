const deviceSocket = require("./deviceSocket");
const devicesSocket = require("./devicesSocket");
const dashboardSocket = require("./dashboardSocket");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const socketMain = async (io) => {
  // Socket middleware to parse & verify your token cookie
  io.use((socket, next) => {
    const raw = socket.handshake.headers.cookie;
    if (!raw) return next(new Error("No cookies"));
    const { token } = cookie.parse(raw);
    if (!token) return next(new Error("Missing token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.of("/dashboard").use((socket, next) => {
    const raw = socket.handshake.headers.cookie;
    if (!raw) return next(new Error("No cookies"));
    const { token } = cookie.parse(raw);
    if (!token) return next(new Error("Missing token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`a socket with id:${socket.id} is connected to the server`);
    console.log("✅ socket connected!", socket.user);
    deviceSocket(socket);
    devicesSocket(socket);
  });

  io.of("/dashboard").on("connection", (socket) => {
    console.log(`a socket with id:${socket.id} is connected to the server`);
    console.log("✅ socket connected!", socket.user);
    console.log("a client is connected");
    dashboardSocket(socket);
  });
};

module.exports = socketMain;
