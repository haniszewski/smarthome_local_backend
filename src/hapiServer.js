import Hapi from "@hapi/hapi";
import { sequelize } from "./services/database.js";
import { User } from "./models/user.js";
import { Device } from "./models/device.js";
import { DeviceType } from "./models/deviceType.js";
import { Sensor } from "./models/sensor.js";
import { Relay } from "./models/relay.js";

import relayRoute from "./routes/temporary/relays.js";
import updateRelayRoute from "./routes/temporary/updateRelay.js";

import "dotenv/config";

const serverConfig = {
  port: process.env.PORT,
  host: process.env.HOST,
};

const initRestServer = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello, World!";
    },
  });

  server.route(relayRoute);
  server.route(updateRelayRoute);

  await sequelize
    .sync
    // ?{ force: true }
    ();

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

export { initRestServer };
