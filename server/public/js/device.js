const socket = io("http://localhost:3000", {
  transports: ["websocket"], // skip polling → go straight to WebSocket
  withCredentials: true, // send cookies along with the handshake
});
let devices = {};

let onlineDevices = [];

socket.on("connect", async () => {
  console.log("connected to the server");

  devices = await socket.emitWithAck("fetchDevices", "all");
  // const devices3 = devices2.map(

  // Create device cards
  renderCards(devices);

  openOnClick(socket);
});

socket.on("connect_error", (err) => {
  console.error("Socket.IO connect failed:", err.message);
});

socket.on("onlineDevices", (onlineDevices) => {
  renderDevicesStatus(devices, onlineDevices);
});

function renderCards(devices) {
  const deviceGrid = document.querySelector(".device-grid");
  deviceGrid.innerHTML = "";
  devices.forEach((device) => {
    console.log(device);
    const card = document.createElement("div");
    card.className = "device-card";
    card.id = `device-card-${device.id}`;
    card.innerHTML = `
            <img src="${device.image}" alt="${device.name}" class="device-image">
            <div class="device-info">
                <h2 class="device-name">${device.name}</h2>
                <p class="device-id">ID: ${device.id}</p>
                <div class="device-status">
                    <span class="status-indicator status-${device.status}"></span>
                    <span class="status-text status-${device.status}-text">${device.status}</span>
                </div>
            </div>
        `;
    deviceGrid.appendChild(card);
  });
}

function openOnClick(socket) {
  // Create a single instance of DynamicDeviceModal
  const deviceModal = new DynamicDeviceModal({ socket });
  // Add click event to each device card
  const deviceCards = document.querySelectorAll(".device-card");
  deviceCards.forEach((card) => {
    card.addEventListener("click", async () => {
      const deviceId = card.id.toString().split("-")[2];
      deviceModal.showDevice(deviceId);
    });
  });
}

document
  .getElementById("add-device-button")
  .addEventListener("click", function () {
    window.location.href = "addDevice";
  });

function renderDevicesStatus(devices, onlineDevices) {
  devices.forEach((device) => {
    device.status = onlineDevices.includes(device.id * 1)
      ? "online"
      : "offline";
    onlineDevices.push(device.id);
    const status = document.querySelector(
      `#device-card-${device.id} .device-status`
    );
    status.innerHTML = `
<div class="device-status">
    <span class="status-indicator status-${device.status}"></span>
    <span class="status-text status-${device.status}-text">${device.status}</span>
</div>
`;
  });
}
