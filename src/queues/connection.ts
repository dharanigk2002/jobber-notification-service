import client, { type Channel, type ChannelModel } from "amqplib";
import { winstonLogger } from "@dharanigk2002/jobber-shared";
import type { Logger } from "winston";

import { config } from "../config.js";

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  "notification-queue-connection",
  "debug",
);

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await client.connect(
      config.RABBITMQ_ENDPOINT,
    );
    const channel: Channel = await connection.createChannel();
    log.info("notification-service connected to queue successfully");
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.error("notification-service error createConnection() method:", error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: ChannelModel) {
  process.once("SIGINT", async function () {
    try {
      log.info(
        "Shutdown signal received. Closing message broker connections...",
      );
      await channel.close();
      await connection.close();

      log.info("RabbitMQ channels closed successfully. Exiting process.");
      process.exit(0);
    } catch (error) {
      log.error("Error encountered during graceful shutdown cleanup:", error);
      process.exit(1);
    }
  });
}
