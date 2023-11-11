import { Device } from "../models/device.js";
import { DeviceType } from "../models/deviceType.js";
import { ReadType } from "../models/readTypes.js";
import { Relay } from "../models/relay.js";
import { Sensor } from "../models/sensor.js";
import { SensorReading } from "../models/sensorReadings.js";
import { SensorType } from "../models/sensorType.js";
import { User } from "../models/user.js";

const initModels = async () => {
  Device.init();
  DeviceType.init();
  ReadType.inig();
  Relay.init();
  Sensor.init();
  SensorReading.init();
  SensorType.init();
  User.init();
};

export { initModels };
