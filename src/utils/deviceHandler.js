import { Socket } from "net";
import { SocketMessage } from "./socketMessage.js";
import { Device } from "../models/device.js";
import { Sensor } from "../models/sensor.js";
import { Relay } from "../models/relay.js";
import { MessageParam } from "./messageParam.js";

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

    this.startRequestingStatus();
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
    console.log(`---ASDASDASDASD----`);
    const device = await Device.getById(msg.hwid);
    this.deviceId = device.id;
    console.log(device);
    if (device != false) {
      const deviceSensors = await Sensor.getByDeviceId(device.id);
      console.log(deviceSensors);
      if (deviceSensors != false) {
        this.sensors = deviceSensors;
      }
      console.log(`---    ----`);
      console.log(`---    ----`);
      console.log(`---    ----`);
      console.log(`---RELAY SEARCH----`);
      console.log(`---    ----`);
      console.log(`---    ----`);
      const deviceRelays = await Relay.getByDeviceId(device.id);
      if (deviceRelays != false) {
        this.relays = deviceRelays;
        console.log(this.relays);

        this.setRelaysInterval = setInterval(async () => {
          if (this.connected) {
            await this.sendRelayStatus();
          } else {
            clearInterval(this.setRelaysInterval);
          }
        }, 15000);
      }
    }
  }

  /**
   *
   * @param {SocketMessage} msg
   */
  async handleResponseStatus(msg) {
    msg.params.forEach((param) => {
      console.log(`Param type: ${param.type}`);
    });
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
      case 5:
        this.handleResponseStatus(recvMsg);
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

  sendRequestStatus() {
    const requestWhoMsg = new SocketMessage(false);
    requestWhoMsg.setRequestStatusMsg();
    const buff = requestWhoMsg.encode();
    this.socket.write(buff);
    console.log(`Requesting status`);
    console.log(buff);
  }

  /**
   *
   * @param {Relay[]} relays
   */
  async sendRelayStatus() {
    const deviceRelays = await Relay.getByDeviceId(this.deviceId);
    if (deviceRelays != false) {
      this.relays = deviceRelays;
      const relayStatusMsg = new SocketMessage(false);
      relayStatusMsg.setRequestRelaySet();
      this.relays.forEach((relay) => {
        const relayParam = new MessageParam(false);
        relayParam.setRelayData(relay);
        relayStatusMsg.params.push(relayParam);
      });
      const buff = relayStatusMsg.encode();
      this.socket.write(buff);

      console.log(`Sending relay status`);
      console.log(buff);
    }
  }

  startRequestingStatus() {
    this.requestStatusInterval = setInterval(async () => {
      if (!this.connected) {
        console.log("Clearing interval Request status");
        clearInterval(this.requestStatusInterval);
      } else {
        this.sendRequestStatus();
      }
    }, 15000);
  }
}

export { DeviceHandler };
