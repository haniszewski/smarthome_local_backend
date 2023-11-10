class DeviceSupervisor {
  constructor() {
    this.devices = new Map();
  }

  addDevice(hwid, device) {
    this.devices.set(hwid, device);
    console.log(`Device added: ${hwid}`);
  }

  removeDevice(hwid) {
    this.devices.delete(hwid);
    console.log(`Device removed: ${hwid}`);
  }

  getDevice(hwid) {
    return this.devices.get(hwid);
  }

  broadcast(data) {
    this.devices.forEach((device) => {
      device.sendData(data);
    });
  }
}

export default DeviceSupervisor;
