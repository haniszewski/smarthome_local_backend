import net from "net";
import { DeviceHandler } from "./utils/deviceHandler.js";
import DeviceSupervisor from "./services/deviceSupervisor.js";

const supervisor = new DeviceSupervisor();

const initTcpServer = async () => {
  const server = net.createServer((socket) => {
    console.log("Device connected");

    const deviceId = `${socket.remoteAddress}:${socket.remotePort}`;

    const deviceHandler = new DeviceHandler(socket);

    supervisor.addDevice(deviceId, deviceHandler);

    socket.on("end", () => {
      supervisor.removeDevice(deviceId);
      console.log(`Device ${deviceId} disconnected`);
    });

    deviceHandler.sendData("Hello, device!");
  });
  server.on("error", (err) => {
    console.error(err);
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("Server is listening on 0.0.0.0:3000");
  });

  setTimeout(() => {
    supervisor.broadcast("Broadcast message to all devices!");
  }, 5000);
};

export { initTcpServer, supervisor };
