import "dotenv/config";

class Config {
  public NODE_ENV: string;
  public CLIENT_URL: string;
  public SENDER_EMAIL: string;
  public SENDER_EMAIL_PASSWORD: string;
  public RABBITMQ_ENDPOINT: string;
  public ELASTIC_SEARCH_URL: string;
  public MAILTRAP_USER: string;
  public MAILTRAP_PASS: string;

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

export const config: Config = new Config();
