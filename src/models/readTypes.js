import { DataTypes, Model } from "sequelize";
import { sequelize } from "../services/database.js";

class ReadType extends Model {}

ReadType.init(
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
    modelName: "read_types",
  },
  {
    freezeTableName: true,
  }
);

export { ReadType };
