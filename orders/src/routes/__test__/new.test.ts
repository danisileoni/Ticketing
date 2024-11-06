import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import Order from "../../models/order";
import Ticket from "../../models/ticket";
import { OrderStatus } from "@dasitickets/common";
import { natsWrapper } from "../../nats-wrapper";

it("return an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("return an error if the ticket is already reserved", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = new Order({
    ticket,
    userId: "asdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
