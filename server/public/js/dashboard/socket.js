const socket = io("/dashboard");

let devices = [];
let peripherals_methods = {};

let components = {};

socket.on("connect", async () => {
  console.log("connected to the server ");
  devices = await socket.emitWithAck("fetchDevices", "all");
  peripherals_methods = await socket.emitWithAck("peripherals_methods", "all");
  console.log(peripherals_methods);
  devices = devices.map((device) => new Device(device));
  console.log(devices);
});

socket.on("sendImmediate", (data) => {
  console.log(data);
});
// socket.on('dashboardCardRes', data => {
//     // console.log(data);

// })

// socket.on('onlineDevices', onlineDevices => {
//     console.log(onlineDevices)
// })
