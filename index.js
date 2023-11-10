import { initRestServer } from "./src/hapiServer.js";
import { initTcpServer } from "./src/socketServer.js";

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

initRestServer();
initTcpServer();