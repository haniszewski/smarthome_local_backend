import { DataTypes, Model, QueryTypes } from "sequelize";
import { sequelize } from "../services/database.js";
import { Device } from "./device.js";
import { SensorType } from "./sensorType.js";

class Sensor extends Device {
  static async getByDeviceId(deviceId) {     
    return this.findAll({
      where: {
        deviceId: deviceId
      },
      type: QueryTypes.SELECT,
      raw: true
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return false;
    })
  }
}

Sensor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    deviceId: {
      type: DataTypes.INTEGER,
      references: {
        model: Device,
        key: 'id'
      }
    },
    typeId: {
        type: DataTypes.INTEGER,
        references: {
            model: SensorType,
            key: "id"
        }
    }
  },
  {
    sequelize,
    modelName: "sensors",
    freezeTableName: true,
  }
);

export { Sensor };
