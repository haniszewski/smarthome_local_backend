// 0x0000 - SENSOR_DATA
// 0x0001 - TEMPERATURE_DATA
// 0x0002 - HUMIDITY_DATA
// 0x0003 - RELAY_DATA

import { Relay } from "../models/relay.js";

export class MessageParam {
  /**
   *
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this.subParams = [];
    if (!buffer) {
      return;
    }
    this.type = this.getParamType(buffer);
    console.log(`Decoding param type ${this.type}`);
    this.length = this.getParamLength(buffer);

    switch (this.type) {
      case 0:
        {
          let remainingLength = this.length - 5;
          while (remainingLength > 0) {
            const subParam = new MessageParam(buffer.subarray(5));
            this.subParams.push(subParam);
            remainingLength -= subParam.length;
          }
        }
        break;

      case 1:
        {
          this.dataType = buffer[5];
          this.temperature = (buffer[6] << 8) | buffer[7];
        }
        break;
      case 2:
        {
          this.dataType = buffer[5];
          this.humidity = (buffer[6] << 8) | buffer[7];
        }
        break;
      case 3:
        {
          this.relayId = buffer[5] >> 1;
          this.relayStatus = buffer[5] & 0x01;
          // todo decode each bit by bit
        }
        break;
    }
  }

  /**
   *
   * @param {Buffer} msg
   * @returns
   */
  getParamType(msg) {
    console.log("Decoding param type");
    console.log(msg);
    console.log("Decoding param type");
    if (msg.length >= 5) {
      return (msg[1] << 8) | msg[2];
    }
    return -1;
  }

  /**
   *
   * @param {Buffer} msg
   * @returns {number}
   */
  getParamLength(msg) {
    return (msg[3] << 8) | msg[4];
  }

  /**
   *
   * @param {Relay} relay
   */
  setRelayData(relay) {
    this.type = 3;
    this.relayId = relay.bus;
    this.relayStatus = relay.targetState;
  }

  encode() {
    console.log(`Encoding param type: ${this.type}`);
    switch (this.type) {
      case 3:
        this.length = 6;
        let relayData = this.relayId << 1;
        if (this.relayStatus) {
          relayData |= 0x01;
        }
        return Buffer.from([0x80, 0x00, 0x03, 0x00, 0x06, relayData]);
        break;
    }
  }
}
