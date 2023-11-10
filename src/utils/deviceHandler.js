import { Socket } from "net";
import { SocketMessage } from "./socketMessage.js";
import { Device } from "../models/device.js";
import { Sensor } from "../models/sensor.js";
import { Relay } from "../models/relay.js";

// deviceHandler.js
class DeviceHandler {
  /**
   *
   * @param {Socket} socket
   */
  constructor(socket) {
    this.socket = socket;
    this.connected = true;
    this.initHandlers();

    this.sensors = [];
    this.relays = [];

    this.interval = setInterval(() => {
      this.sendKeepalive();
      if (!this.connected) {
        console.log("Clearing interval");
        clearInterval(this.interval);
      }
    }, 5000);

    this.sendRequestWho();
  }

  initHandlers() {
    this.socket.on("data", this.handleData.bind(this));
    this.socket.on("end", this.handleEnd.bind(this));
    this.socket.on("error", this.handleError.bind(this));
  }

  /**
   *
   * @param {SocketMessage} msg
   */
  async handleResponseWho(msg) {
    // Find device
    const device = await Device.getById(msg.hwid);
    console.log(device);
    if(device != false){
      const deviceSensors = await Sensor.getByDeviceId(device.id);
      console.log(deviceSensors);
      if(deviceSensors != false){
        this.sensors = deviceSensors;
      }
      const deviceRelays = await Relay.getByDeviceId(device.id);
      if(deviceRelays != false){
        this.relays = deviceRelays;
        console.log(this.relays);
      }
    }
    
    
  }

  /**
   *
   * @param {Bufer} data
   */
  handleData(data) {
    console.log(`Received data from device: ${data}`);
    console.log(data);
    const recvMsg = new SocketMessage(data);
    switch (recvMsg.type) {
      case 1:
        break;
      case 3:
        this.handleResponseWho(recvMsg);
        break;
    }
  }

  handleEnd() {
    console.log("Device disconnected");
    this.connected = false;
  }

  handleError() {
    console.log("Error, disconnecting");
    this.connected = false;
  }

  sendData(data) {
    this.socket.write(data);
  }

  sayHello() {
    this.socket.write("Hello");
  }

  /**
   * Send ping - KEEPALIVE
   */
  sendKeepalive() {
    const keepAliveMsg = new SocketMessage(false);
    keepAliveMsg.setKeepaliveMsg();
    const buff = keepAliveMsg.encode();
    this.socket.write(buff);
  }

  sendRequestWho() {
    const requestWhoMsg = new SocketMessage(false);
    requestWhoMsg.setRequestWhoMsg();
    const buff = requestWhoMsg.encode();
    this.socket.write(buff);
    console.log(`Asking who`);
    console.log(buff);
  }
}

export { DeviceHandler };
