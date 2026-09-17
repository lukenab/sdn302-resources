import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";

import { TicketModel } from "./models/ticket.model.js";
import { UserModel } from "./models/user.model.js";

import { TicketService } from "./services/ticket.service.js";
import { UserService } from "./services/user.service.js";

import { createTicketController } from "./controllers/ticket.controller.js";
import { createUserController } from "./controllers/user.controller.js";

import { createTicketRouter } from "./routes/ticket.routes.js";
import { createUserRouter } from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export function createApp({ database }) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());

  const ticketModel = new TicketModel(database);
  const userModel = new UserModel(database);

  const ticketService = new TicketService(ticketModel);
  const userService = new UserService(userModel, ticketModel);

  const ticketController = createTicketController(ticketService);
  const userController = createUserController(userService);

  const ticketRouter = createTicketRouter(ticketController);
  const userRouter = createUserRouter(userController);

  app.get("/health", (_req, res) => {
    return res.status(200).json({
      status: "ok",
    });
  });

  app.use("/api/tickets", ticketRouter);
  app.use("/api/users", userRouter);

  app.use(errorHandler);

  return app;
}
