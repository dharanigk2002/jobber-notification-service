import { Client } from "@elastic/elasticsearch";
import { winstonLogger } from "@dharanigk2002/jobber-shared";
import { config } from "./config.js";
const elasticsearchClient = new Client({
    node: config.ELASTIC_SEARCH_URL,
    maxRetries: 2,
    requestTimeout: 10000,
});
const log = winstonLogger(config.ELASTIC_SEARCH_URL, "notification-elasticsearch", "debug");
export async function checkConnection() {
    let isConnected = false;
    while (!isConnected) {
        try {
            const health = await elasticsearchClient.cluster.health();
            log.info(`notification-service elastic search health status - ${health.status}`);
            isConnected = true;
        }
        catch (error) {
            log.error("Connection to elastic search failed. retrying...");
            log.error("notification-service checkConnection() method:", error);
        }
    }
}
//# sourceMappingURL=elasticsearch.js.map