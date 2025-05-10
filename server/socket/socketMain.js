const deviceSocket = require("./deviceSocket");
const devicesSocket = require("./devicesSocket");
const dashboardSocket = require("./dashboardSocket");

const socketMain = async (io) => {
  io.on("connection", (socket) => {
    console.log(`a socket with id:${socket.id} is connected to the server`);
    console.log("✅ socket connected!", socket.user);
    deviceSocket(socket);
    devicesSocket(socket);
  });

  io.of("/dashboard").on("connection", (socket) => {
    console.log("a client is connected");
    dashboardSocket(socket);
  });
};

module.exports = socketMain;
