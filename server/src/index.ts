import express from "express";
import _api from "./api";
import http from "http";
import { env } from "./core/config/env";

async function main() {
  const app = _api(express());

  const server = http.createServer(app);

  server.listen(env.port, () => {
    console.log(`Server is running live on ${env.port}`);
  });
}

main().catch((err) => {
  console.log("ERORR :: ", err);
});
