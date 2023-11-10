// relay.js
import { DataTypes, Model, QueryTypes } from "sequelize";
import { sequelize } from "../services/database.js";
import { Device } from "./device.js";

class Relay extends Device {
  static async getByDeviceId(deviceId) {
    return this.findAll({
      where: {
        deviceId: deviceId,
      },
      type: QueryTypes.SELECT,
      raw: true,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}

Relay.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deviceId: {
      type: DataTypes.INTEGER,
      references: {
        model: Device,
        key: "id",
      },
    },
    bus: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    targetState: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    currentState: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: "relays",
  },
  {
    freezeTableName: true,
  }
);

export { Relay };
