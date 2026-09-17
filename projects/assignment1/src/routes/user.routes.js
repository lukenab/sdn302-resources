import { Router } from "express";

export function createUserRouter(userController) {
  const router = Router();

  router.patch("/:id/vip", userController.updateVipStatus);
  router.delete("/:id/tickets", userController.deleteUserTickets);

  return router;
}
