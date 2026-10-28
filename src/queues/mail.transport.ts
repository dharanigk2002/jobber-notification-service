import { winstonLogger, type IEmailLocals } from "@dharanigk2002/jobber-shared";
import type { Logger } from "winston";

import { config } from "../config.js";
import { emailTemplates } from "../helper.js";

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  "notification-app",
  "debug",
);

export async function sendEmail(
  template: string,
  receiverEmail: string,
  locals: IEmailLocals,
): Promise<void> {
  try {
    await emailTemplates(template, receiverEmail, locals);
    log.info("Email sent successfully.");
  } catch (error) {
    log.error(
      "notification-service MailTransport sendEmail() method error:",
      error,
    );
  }
}
