// 0x0000 - SENSOR_DATA
// 0x0001 - TEMPERATURE_DATA
// 0x0002 - HUMIDITY_DATA
// 0x0003 - RELAY_DATA

export class MessageParam {
  /**
   *
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this.type = this.getParamType(buffer);
    this.length = this.getParamLength(buffer);
    this.subParams = [];
    switch (paramType) {
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
            this.relayId = (buffer[5] >> 1) ;
            this.relayStatus = (buffer[5] & 0x01);
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
    if (msg.length >= 5) {
      return ((msg[1] << 8) | msg[2]);
    }
    return -1;
  }

  /**
   *
   * @param {Buffer} msg
   * @returns {number}
   */
  getParamLength(msg) {
    return ((msg[3] << 8) | msg[4]);
  }
}

