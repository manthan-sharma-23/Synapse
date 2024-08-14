import express from "express";
import _api from "./api";
import http from "http";
import { env } from "./core/config/env";
import SocketService from "./core/services/socket.service";

async function main() {
  const app = _api(express());

  const server = http.createServer(app);
  new SocketService(server);

  server.listen(env.port, () => {
    console.log(`Server is running live on ${env.port}`);
  });
}

main().catch((err) => {
  console.log("ERORR :: ", err);
});
