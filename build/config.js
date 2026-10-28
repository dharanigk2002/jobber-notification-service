import "dotenv/config";
class Config {
    NODE_ENV;
    CLIENT_URL;
    SENDER_EMAIL;
    SENDER_EMAIL_PASSWORD;
    RABBITMQ_ENDPOINT;
    ELASTIC_SEARCH_URL;
    MAILTRAP_USER;
    MAILTRAP_PASS;
    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || "";
        this.CLIENT_URL = process.env.CLIENT_URL || "";
        this.SENDER_EMAIL = process.env.SENDER_EMAIL || "";
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || "";
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || "";
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || "";
        this.MAILTRAP_USER = process.env.MAILTRAP_USER || "";
        this.MAILTRAP_PASS = process.env.MAILTRAP_PASS || "";
    }
}
export const config = new Config();
//# sourceMappingURL=config.js.map