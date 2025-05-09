class DynamicDeviceModal extends Modal {
  constructor(options = {}) {
    const buttons = [
      // modal-close
      {
        text: "Close",
        type: "secondary",
        id: "device-modal-close",
        handler: () => this.close(),
      },
      {
        text: "Update",
        type: "primary",
        id: "device-modal-update",

        handler: () => this.controlDevice(),
      },
      {
        text: "x",
        id: "header-device-modal-close",
        handler: () => this.close(),
      },
    ];

    super({
      id: "dynamic-device-modal",
      title: options.title || "Device Details",
      content: '<div id="dynamic-device-content"></div>',
      buttons: buttons,
      onOpen: options.onOpen,
      onClose: () => clearInterval(this.displayInterval),
      onUpdate: () => console.log("updated"),
    });

    this.device = null;
    this.fieldsValues = {};
  }

  toTitleCase(str) {
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .toLowerCase() // Convert entire string to lowercase
      .split(" ") // Split string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(" "); // Join words back into a single string
  }

  async showConnections() {
    this.update({ title: "Connection details" });

    const contentContainer = document.createElement("div");

    contentContainer.innerHTML = "";

    const pages = {
      page1: `here is  the connection of page 1 : 
            pins 1 
            pin 2 
            pin 3 
            pin 4 `,
      page2: `here is  the connection of page 2 : 
            pins 1 
            pin 2 
            pin 3 
            pin 4 `,
    };

    for (const [key, value] of Object.entries(pages)) {
      if (!["__v", "automatedFunctions", "_id"].includes(key)) {
        if (key === "dictVariables") {
          const connected_devices = [];
          for (const [key2, value2] of Object.entries(
            this.device.dictVariables
          )) {
            connected_devices.push(this.toTitleCase(key2));
          }
          const fieldElement = this.renderField(
            "Connected Devices",
            connected_devices.join(", ")
          );
          if (fieldElement) {
            contentContainer.appendChild(fieldElement);
          }
        } else {
          if (key === "dictList") continue;
          const fieldElement = this.renderField(key, value);
          if (fieldElement) {
            contentContainer.appendChild(fieldElement);
          }
        }
      }
    }

    this.setContent(contentContainer);

    this.open();
  }

  async showDevice(socket, deviceId) {
    this.fieldsValues = {};
    this.device = await socket.emitWithAck("deviceClick", deviceId);
    this.update({ title: this.device.name || "Device Details" });

    const contentContainer = document.createElement("div");

    contentContainer.innerHTML = "";

    for (const [key, value] of Object.entries(this.device)) {
      if (!["__v", "automatedFunctions", "_id"].includes(key)) {
        if (key === "dictVariables") {
          const connected_devices = [];
          for (const [key2, value2] of Object.entries(
            this.device.dictVariables
          )) {
            connected_devices.push(this.toTitleCase(key2));
          }
          const fieldElement = this.renderField(
            "Connected Devices",
            connected_devices.join(", ")
          );
          if (fieldElement) {
            contentContainer.appendChild(fieldElement);
          }
        } else {
          if (key === "dictList") continue;
          const fieldElement = this.renderField(key, value);
          if (fieldElement) {
            contentContainer.appendChild(fieldElement);
          }
        }
      }
    }

    this.setContent(contentContainer);

    const controlButton = document.getElementById("device-modal-update");
    if (controlButton) {
      controlButton.textContent = this.device.status
        ? "Show Pin Connection"
        : "Restart Device";
    }

    this.open();

    this.displayInterval = setInterval(async () => {
      this.device = await socket.emitWithAck("deviceClick", deviceId);
      for (const [key, value] of Object.entries(this.fieldsValues)) {
        const fieldValue = document.getElementById(value);
        if (this.device[key])
          if (key === "status")
            fieldValue.textContent = this.device[key] ? "online" : "offline";
          else fieldValue.textContent = this.device[key].toString();
        else if (this.device.dictVariables[key])
          fieldValue.textContent = this.device.dictVariables[key].toString();
      }
    }, 4000);
  }

  renderField(key, value) {
    const fieldElement = document.createElement("div");
    fieldElement.className = "field-item";

    const label = document.createElement("div");
    label.className = "field-label";
    label.textContent = this.formatLabel(key);

    const valueElement = document.createElement("div");
    valueElement.className = "field-value";

    if (key === "image" && typeof value === "string") {
      const img = document.createElement("img");

      img.src = value;
      img.alt = "Device image";
      img.className = "field-image";
      fieldElement.appendChild(img);
    } else if (key === "status") {
      value = value ? "online" : "offline";
      const statusIndicator = document.createElement("span");
      statusIndicator.className = `status-indicator status-${value.toLowerCase()}`;

      const statusText = document.createElement("span");

      this.fieldsValues[key] = key + "-field-value";
      statusText.id = this.fieldsValues[key];

      statusText.textContent = value;
      statusText.className = `status-text status-${value.toLowerCase()}-text`;

      valueElement.appendChild(statusIndicator);
      valueElement.appendChild(statusText);
    } else {
      valueElement.textContent = value.toString();
      this.fieldsValues[key] = key + "-field-value";
      valueElement.id = this.fieldsValues[key];
    }
    if (key !== "image") {
      fieldElement.appendChild(label);
      fieldElement.appendChild(valueElement);
    }

    return fieldElement;
  }

  formatLabel(key) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  controlDevice() {
    if (!this.device) return;

    if (this.device.status) {
      console.log("here is the connected pins : ");
      const deviceModal = new DynamicDeviceModal();
      deviceModal.showConnections();
    } else {
      alert(`Attempting to restart ${this.device.name}...`);
    }
  }
}
