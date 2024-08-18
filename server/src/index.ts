import express from "express";
import _api from "./api";
import http from "http";
import { env } from "./core/config/env";
import SocketService from "./core/services/socket.service";
import { createWorkers } from "./core/services/conferencing-services/worker";

async function main() {
  const app = _api(express());

  app.get("/", (req, res) => {
    return res.send("Server is live at 2700");
  });

  const server = http.createServer(app);
  new SocketService(server);

  (async () => {
    await createWorkers();
  })();

  server.listen(env.port, () => {
    console.log(`Server is running live on ${env.port}`);
  });
}

main().catch((err) => {
  console.log("ERORR :: ", err);
});
