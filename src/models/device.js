import { DataTypes, Model, QueryTypes } from "sequelize";
import { sequelize } from "../services/database.js";

/**
 * @extends Model
 */
class Device extends Model {
  static async getById(deviceId) {     
    return this.findOne({
      where: {
        hwid: deviceId
      },
      type: QueryTypes.SELECT,
      raw: true
    })
    .then((res) => {
      if (!res){
        return false;
      }
      return res;
      
    })
    .catch((err) => {
      console.log(err);
      return false;
    })
  }
}

Device.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    hwid: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "devices",
  },
  {
    freezeTableName: true,
  }
);

export { Device };
