import "dotenv/config";
const env = process.env.NODE_ENV || "development";

const dbConfig = {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
}

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.pass, {
  host: dbConfig.host,
  dialect: "postgres",
});

export {
    sequelize
}
