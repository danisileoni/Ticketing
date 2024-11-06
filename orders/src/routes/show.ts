import express, { Request, Response } from "express";
import Order from "../models/order";
import {
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@dasitickets/common";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    res.send(order);
  },
);

export { router as showOrderRouter };
