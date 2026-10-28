import express, { type Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

export function healthRoute(): Router {
  return router.get("/notification-health", (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send("Notification service is up and running");
  });
}
