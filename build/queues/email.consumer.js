import { winstonLogger } from "@dharanigk2002/jobber-shared";
import {} from "winston";
import { config } from "../config.js";
import { createConnection } from "./connection.js";
import { sendEmail } from "./mail.transport.js";
const log = winstonLogger(config.ELASTIC_SEARCH_URL, "email-consumer", "debug");
export async function consumeAuthEmailMessages(channel) {
    try {
        if (!channel) {
            channel = (await createConnection());
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
        channel.consume(jobberQueue.queue, async (msg) => {
            if (!msg) {
                return;
            }
            console.log(JSON.parse(msg.content.toString()));
            // send emails
            // acknowledge
            channel.ack(msg);
        });
    }
    catch (error) {
        log.error("notification-service EmailConsumer consumeAuthEmailMessages() method error:", error);
    }
}
export async function consumeOrderEmailMessages(channel) {
    try {
        if (!channel) {
            channel = (await createConnection());
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
        channel.consume(jobberQueue.queue, async (msg) => {
            if (!msg) {
                return;
            }
            const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
            const locals = {
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
    }
    catch (error) {
        log.error("notification-service EmailConsumer consumeAuthEmailMessages() method error:", error);
    }
}
//# sourceMappingURL=email.consumer.js.map