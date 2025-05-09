class DynamicDeviceModal extends Modal {
  constructor(options = {}) {
    let buttons = [
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

    if (options.no_update) {
      buttons = buttons.filter(
        (button) => button.text !== "Update" && button.text !== "Close"
      );
      const closeButton = {
        text: "Close",
        type: "primary",
        id: "device-modal-close",
        handler: () => this.close(),
      };
      buttons.push(closeButton);
    }
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
    this.socket = options.socket;
  }

  toTitleCase(str) {
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .toLowerCase() // Convert entire string to lowercase
      .split(" ") // Split string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(" "); // Join words back into a single string
  }

  async showConnections(
    data = `
        1- connect the vss of esp to volate pin of dht 
        2- connect the pin 13 of esp32 to pin 2 of dht 
        1- connect the vss of esp to volate pin of dht 
        2- connect the pin 13 of esp32 to pin 2 of dht 
        1- connect the vss of esp to volate pin of dht 
        2- connect the pin 13 of esp32 to pin 2 of dht 
        `
  ) {
    this.update({ title: "Connection details" });

    const contentContainer = document.createElement("div");

    contentContainer.innerHTML = "";

    const fieldElement = this.renderField("pin_connection", data);
    if (fieldElement) {
      contentContainer.appendChild(fieldElement);
    }

    this.setContent(contentContainer);

    this.open();
  }

  async showDevice(deviceId) {
    this.fieldsValues = {};
    if (!this.socket) return;

    this.device = await this.socket.emitWithAck("deviceClick", deviceId);
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
    } else if (key === "pin_connection") {
      // Add pin-connection class to the field-item parent element
      fieldElement.classList.add("pin-connection-field");

      // Add pin-connection class to the label
      label.classList.add("pin-connection-label");

      // Add pin-connection class to the value element
      valueElement.classList.add("pin-connection-value");

      const textArea = document.createElement("textarea");
      textArea.className = "pin-connection-textarea auto-expand";
      textArea.value = typeof value === "string" ? value : "No connection data";
      textArea.readOnly = true;

      // Auto-resize function
      const autoResize = () => {
        textArea.style.height = "auto"; // Reset height
        textArea.style.height = textArea.scrollHeight + "px"; // Set to scrollHeight
      };

      // Set initial height after content is loaded
      setTimeout(autoResize, 0);

      // Add the textarea to the DOM
      valueElement.appendChild(textArea);
      this.fieldsValues[key] = key + "-field-value";
      valueElement.id = this.fieldsValues[key];
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

  async controlDevice() {
    if (!this.device) return;

    if (this.device.status) {
      console.log("here is the connected pins : ");
      const deviceModal = new DynamicDeviceModal({ no_update: true });

      this.socket.emitWithAck("getConnections", this.device.id).then((data) => {
        console.log("this is the recieved data : ");
        console.log(data);

        deviceModal.showConnections(data.join("\n"));
      });
    } else {
      alert(`Attempting to restart ${this.device.name}...`);
    }
  }
}
