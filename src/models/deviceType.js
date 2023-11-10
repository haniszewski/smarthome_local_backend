import { DataTypes, Model } from "sequelize";
import { sequelize } from "../services/database.js";

class DeviceType extends Model {}

DeviceType.init(
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
    modelName: "device_types",
  },
  {
    freezeTableName: true,
  }
);

export { DeviceType };
