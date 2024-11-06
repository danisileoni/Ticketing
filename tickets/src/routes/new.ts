import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  InternalServerError,
  requireAuth,
  validateRequest,
} from "@dasitickets/common";
import Ticket from "../models/ticket";
import { TicketCreatedPubliser } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater that 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    try {
      const ticket = new Ticket({
        title,
        price,
        userId: req.currentUser!.id,
      });

      await ticket.save();

      await new TicketCreatedPubliser(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        __v: ticket.__v!,
      });

      res.status(201).send(ticket);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Check logs server");
    }
  },
);

export { router as createTicketRouter };
