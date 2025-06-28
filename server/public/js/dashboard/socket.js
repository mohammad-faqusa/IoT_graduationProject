const socket = io("http://localhost:3000/dashboard", {
  transports: ["websocket"], // skip polling → go straight to WebSocket
  withCredentials: true, // send cookies along with the handshake
});

let devices = [];
const peripherals = {};
let peripherals_interface_info = {};

let components = {};

socket.on("connect", async () => {
  console.log("connected to the server ");
  devices = await socket.emitWithAck("fetchDevices", "all");
  peripherals_interface_info = await socket.emitWithAck(
    "peripherals_interface_info",
    "all"
  );
  console.log(peripherals_interface_info);

  devices = devices.map((device) => new Device(device));
  console.log(devices);
});

socket.on("sendImmediate", (data) => {
  console.log(data);
});

socket.on("deviceTrigger", (data) => {
  console.log(data);
});
