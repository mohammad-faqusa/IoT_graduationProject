const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });
const http = require("http");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

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

socketMain(io);

server.listen(3000, () => console.log("Listening on 3000"));
