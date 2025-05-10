const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });
const http = require("http");

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

socketMain(io);

server.listen(3000, () => console.log("Listening on 3000"));
