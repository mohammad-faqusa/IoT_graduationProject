class Device {
  constructor(deviceObject) {
    this.name = deviceObject.name;
    this.id = deviceObject.id;
    this.location = deviceObject.location;
    this.dictVariables = deviceObject.dictVariables;
    this.status = deviceObject.status;
  }

  stringInfo() {
    return `name : ${this.name}, id: ${this.id}, location: ${
      this.location
    }, peripherals: ${JSON.stringify(this.dictVariables)}, status: ${
      this.status
    }`;
  }

  get pList() {
    return Object.entries(this.dictVariables);
  }
}
