import { winstonLogger } from "@dharanigk2002/jobber-shared";
import { config } from "../config.js";
import { emailTemplates } from "../helper.js";
const log = winstonLogger(config.ELASTIC_SEARCH_URL, "notification-app", "debug");
export async function sendEmail(template, receiverEmail, locals) {
    try {
        await emailTemplates(template, receiverEmail, locals);
        log.info("Email sent successfully.");
    }
    catch (error) {
        log.error("notification-service MailTransport sendEmail() method error:", error);
    }
}
//# sourceMappingURL=mail.transport.js.map