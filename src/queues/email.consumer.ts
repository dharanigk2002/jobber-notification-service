import { winstonLogger, type IEmailLocals } from "@dharanigk2002/jobber-shared";
import type { Channel, ConsumeMessage } from "amqplib";
import { type Logger } from "winston";

import { config } from "../config.js";
import { createConnection } from "./connection.js";
import { sendEmail } from "./mail.transport.js";

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  "email-consumer",
  "debug",
);

export async function consumeAuthEmailMessages(
  channel: Channel,
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = "jobber-email-notification";
    const routingKey = "auth-email";
    const queueName = "auth-email-queue";
    await channel.assertExchange(exchangeName, "direct");
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true, // when queue restarts the message should be kept
      autoDelete: false, // remove message once we acknowledge(ack method)
    });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      if (!msg) {
        return;
      }
      const { receiverEmail, username, verifyLink, resetLink, template } =
        JSON.parse(msg.content.toString());
      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL,
        appIcon: "https://i.ibb.co/DHkWsCyT/image-d5079cb6.jpg",
        username,
        verifyLink,
        resetLink,
      };
      // send emails
      await sendEmail(template, receiverEmail, locals);
      // acknowledge
      channel.ack(msg);
    });
  } catch (error) {
    log.error(
      "notification-service EmailConsumer consumeAuthEmailMessages() method error:",
      error,
    );
  }
}

export async function consumeOrderEmailMessages(
  channel: Channel,
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = "jobber-order-notification";
    const routingKey = "order-email";
    const queueName = "order-email-queue";

    await channel.assertExchange(exchangeName, "direct");

    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true, // when queue restarts the message should be kept
      autoDelete: false, // remove message once we acknowledge(ack method)
    });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      if (!msg) {
        return;
      }
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      } = JSON.parse(msg.content.toString());
      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL,
        appIcon: "https://i.ibb.co/DHkWsCyT/image-d5079cb6.jpg",
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      };
      // send emails
      if (template === "orderPlaced") {
        await sendEmail("orderPlaced", receiverEmail, locals);
        await sendEmail("orderReceipt", receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      // acknowledge
      channel.ack(msg);
    });
  } catch (error) {
    log.error(
      "notification-service EmailConsumer consumeAuthEmailMessages() method error:",
      error,
    );
  }
}
