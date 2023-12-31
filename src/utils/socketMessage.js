// 0x0000 - keepalive
// 0x0001 - keepaliveAck
// 0x0002 - WHO_REQUEST
// 0x0003 - WHO_RESPONSE
// 0x0004 - STATUS_REQUEST
// 0x0005 - STATUS_RESPONSE
// 0x0006 - SET_RELAYS_REQUEST
// 0x0007 - SET_RELAYS_RESPONSE

import { MessageParam } from "./messageParam.js";

export class SocketMessage {
  /**
   *
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this.params = [];
    if (!buffer) {
      return;
    }
    this.buffer = buffer;
    this.type = this.getMessageType(buffer);
    this.length = this.getMessageLength(buffer);

    console.log(`Decoding message type ${this.type}`);

    switch (this.type) {
      case 1:
        // Keaapalivie ACK
        console.log("received keepalive ack");

        break;
      case 3:
        // Handle WHO_Response
        this.hwid = (buffer[5] << 8) | buffer[6];
        console.log(`this hwid is: ${this.hwid}`);
        break;

      case 5:
        // Handle STATUS_RESPONSE
        {
          let remainingLength = this.length - 5;
          while (remainingLength > 0) {
            const param = new MessageParam(buffer.subarray(5));
            this.params.push(param);
            remainingLength -= param.length;
          }
        }
        break;

      case 7:
        // Handle Relay_Response
        console.log(`Received Relay response`);
        break;

      default:
        break;
    }
  }

  setKeepaliveMsg() {
    this.length = 5;
    this.type = 0;
  }

  setRequestWhoMsg() {
    this.length = 5;
    this.type = 2;
  }

  setRequestStatusMsg() {
    this.length = 5;
    this.type = 4;
  }

  setRequestRelaySet() {
    this.length = 5;
    this.type = 6;
  }

  encodeLength() {
    let length = this.length;
    this.params.forEach((param) => {
      console.log(`Param length: ${param.length}`);
      length += param.length;
    });

    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(length, 0);
    console.log(`Calculated length: ${length}`);
    return buffer;
  }

  getRelaysData() {
    const res = [];
    for (const param in this.params) {
      if (param.type === 3) {
        res.push({
          id: param.relayId,
          status: param.relayStatus,
        });
      }
    }
    return res;
  }

  /**
   *
   * @param {Buffer} msg
   * @returns
   */
  getMessageType(msg) {
    if (msg.length >= 5) {
      return (msg[1] << 8) | msg[2];
    }
    return -1;
  }

  /**
   *
   * @param {Buffer} msg
   * @returns {number} message length
   */
  getMessageLength(msg) {
    return (msg[3] << 8) | msg[4];
  }

  createRequestWhoMsg() {
    return Buffer.from([0x00, 0x00, 0x01, 0x00, 0x05]);
  }

  encode() {
    console.log(`Encoding message type: ${this.type}`);
    switch (this.type) {
      case 0:
        return Buffer.from([0x80, 0x00, 0x00, 0x00, 0x05]);
        break;
      case 2:
        return Buffer.from([0x80, 0x00, 0x02, 0x00, 0x05]);
        break;
      case 4:
        return Buffer.from([0x80, 0x00, 0x04, 0x00, 0x05]);
        break;
      case 6:
        {
          const length = this.encodeLength();
          console.log(length);
          let respBuff = Buffer.from([0x00, 0x00, 0x06, length[0], length[1]]);
          this.params.forEach((param) => {
            respBuff = Buffer.concat([respBuff, param.encode()]);
            // respBuff.join(param.encode());
            console.log(param.encode());
          });
          console.log("----");
          console.log(respBuff);
          console.log("----");
          return respBuff;
        }
        break;
    }
  }

  /**
   * Acknowledges Keepalive on socket
   * @param {Buffer} buffer
   * @returns {Buffer}
   */
  handleKeepAlive(buffer) {
    return Buffer.from([0x80, 0x00, 0x01, 0x00, 0x05]);
  }
}
