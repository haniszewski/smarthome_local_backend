import { DataTypes, Model } from "sequelize";
import { sequelize } from "../services/database.js";
import { ReadType } from "./readTypes.js";

class SensorReading extends Model {}

SensorReading.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    dataType: {
      type: DataTypes.INTEGER,
      references: {
        model: ReadType,
        key: "id"
      }
    },
  },
  {
    sequelize,
    modelName: "sensor_readings",
  },
  {
    freezeTableName: true,
  }
);

export { SensorReading };
