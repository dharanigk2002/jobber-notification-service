import { type Application } from "express";
import http from "http";
import type { Logger } from "winston";
import {
  winstonLogger,
  type IEmailMessageDetails,
} from "@dharanigk2002/jobber-shared";

import { config } from "./config.js";
import { healthRoute } from "./routes.js";
import { checkConnection } from "./elasticsearch.js";
import { createConnection } from "./queues/connection.js";
import type { Channel } from "amqplib";
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from "./queues/email.consumer.js";

const SERVER_PORT = 4001;

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  "notification-service",
  "debug",
);

export function start(app: Application): void {
  startServer(app);
  app.use("", healthRoute);
  void checkConnection();
  void startQueues();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
}

function startServer(app: Application): void {
  try {
    const httpServer = http.createServer(app);
    log.info(
      `Worker with process id of ${process.pid} on notification-service has started`,
    );
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.error("notification-service startServer() method error:", error);
  }
}
