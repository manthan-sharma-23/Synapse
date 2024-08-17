import { AppData } from "mediasoup/node/lib/types";
import { config } from "../../config/mediasoup";
import * as mediasoup from "mediasoup";
import { Worker } from "mediasoup/node/lib/Worker";

let workers: Worker[] = [];
export let nextMediasoupWorkerIdx = 0;

export async function createWorkers() {
  let { numWorkers } = config.mediasoup;
  for (let i = 0; i < numWorkers; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      logTags: config.mediasoup.worker.logTags,
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });
    worker.on("died", () => {
      console.error(
        "mediasoup worker died, exiting in 2 seconds... [pid:%d]",
        worker.pid
      );
      setTimeout(() => process.exit(1), 2000);
    });

    workers.push(worker);
  }
}

export function getMediasoupWorker() {
  const worker = workers[nextMediasoupWorkerIdx];
  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;
  return worker;
}
