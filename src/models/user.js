import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../services/database.js";

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "users",
  },
  {
    freezeTableName: true
  }
);

export { User };
