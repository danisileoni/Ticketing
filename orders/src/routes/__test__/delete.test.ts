import request from "supertest";
import { app } from "../../app";
import Ticket from "../../models/ticket";
import { OrderStatus } from "@dasitickets/common";
import Order from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

const buildTicket = async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("marks an order as cancelled", async () => {
  const ticket = await buildTicket();

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updateOrder = await Order.findById(order.id);

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const ticket = await buildTicket();

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
