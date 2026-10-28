import express from "express";
import { winstonLogger } from "@dharanigk2002/jobber-shared";
import type { Logger } from "winston";

import { config } from "./config.js";
import { start } from "./server.js";
import path from "path";
import { fileURLToPath } from "url";

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  "notification-app",
  "debug",
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

function initialize() {
  const app = express();
  start(app);
  log.info("notification-service initialized");
}

initialize();
