import { initRestServer } from "./src/hapiServer.js";
import { initModels } from "./src/services/modelInit.js";
import { initTcpServer } from "./src/socketServer.js";

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

const run = (async () => {
  // await initModels();
  initRestServer();
  initTcpServer();
});

run();
