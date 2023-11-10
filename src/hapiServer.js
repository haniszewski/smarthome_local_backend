import Hapi from "@hapi/hapi";
import { sequelize } from "./services/database.js";
import { User } from "./models/user.js";
import { Device } from "./models/device.js";
import { DeviceType } from "./models/deviceType.js";
import { Sensor } from "./models/sensor.js";
import { Relay } from "./models/relay.js";

import "dotenv/config";

const serverConfig = {
  port: process.env.PORT,
  host: process.env.HOST
}

const initRestServer = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello, World!";
    },
  });

  await sequelize.sync({ force: true });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

export { initRestServer };
