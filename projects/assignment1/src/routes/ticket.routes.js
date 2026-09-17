import { Router } from "express";

export function createTicketRouter(ticketController) {
  const router = Router();

  router.get("/available", ticketController.getAvailableTickets);
  router.get("/user/:userId", ticketController.getTicketsByUser);

  return router;
}
