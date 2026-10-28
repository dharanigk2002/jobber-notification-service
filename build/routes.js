import express, {} from "express";
import { StatusCodes } from "http-status-codes";
const router = express.Router();
export function healthRoute() {
    return router.get("/notification-health", (_req, res) => {
        res.status(StatusCodes.OK).send("Notification service is up and running");
    });
}
//# sourceMappingURL=routes.js.map