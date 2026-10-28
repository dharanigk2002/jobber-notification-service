import { winstonLogger, type IEmailLocals } from "@dharanigk2002/jobber-shared";
import type { Logger } from "winston";
import nodemailer, { type Transporter } from "nodemailer";
import Email from "email-templates";
import path from "path";

import { config } from "./config.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  "mail-transport-helper",
  "debug",
);

export async function emailTemplates(
  template: string,
  to: string,
  locals: IEmailLocals,
): Promise<void> {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: config.MAILTRAP_USER,
        pass: config.MAILTRAP_PASS,
      },
    });
    const email = new Email({
      message: {
        from: `Jobber App<${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: transporter,
      views: {
        root: path.join(__dirname, "emails"),
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "emails"),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, "emails", template),
      message: { to },
      locals,
    });
  } catch (error) {
    log.error("Failed to send email in emailTemplates() error:", error);
  }
}
