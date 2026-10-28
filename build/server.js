import express, {} from "express";
import http from "http";
import { winstonLogger, } from "@dharanigk2002/jobber-shared";
import { config } from "./config.js";
import { healthRoute } from "./routes.js";
import { checkConnection } from "./elasticsearch.js";
import { createConnection } from "./queues/connection.js";
import { consumeAuthEmailMessages, consumeOrderEmailMessages, } from "./queues/email.consumer.js";
const SERVER_PORT = 4001;
const log = winstonLogger(config.ELASTIC_SEARCH_URL, "notification-service", "debug");
export function start(app) {
    startServer(app);
    app.use(healthRoute);
    void checkConnection();
    void startQueues();
}
async function startQueues() {
    const emailChannel = (await createConnection());
    await consumeAuthEmailMessages(emailChannel);
    await consumeOrderEmailMessages(emailChannel);
    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=1234654321sdfs`;
    const messageDetails = {
        receiverEmail: config.SENDER_EMAIL,
        resetLink: verificationLink,
        username: "john.doe",
        template: "forgotPassword",
    };
    await emailChannel.assertExchange("jobber-email-notification", "direct");
    const message = JSON.stringify(messageDetails);
    emailChannel.publish("jobber-order-notification", "order-email", Buffer.from(message));
}
function startServer(app) {
    try {
        const httpServer = http.createServer(app);
        log.info(`Worker with process id of ${process.pid} on notification-service has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notification service running on port ${SERVER_PORT}`);
        });
    }
    catch (error) {
        log.error("notification-service startServer() method error:", error);
    }
}
//# sourceMappingURL=server.js.map