import { DataTypes, Model } from "sequelize";
import { sequelize } from "../services/database.js";

class SensorType extends Model {}

SensorType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "sensor_types",
  },
  {
    freezeTableName: true,
  }
);

export { SensorType };
