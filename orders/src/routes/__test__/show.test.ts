import request from "supertest";
import { app } from "../../app";
import Ticket from "../../models/ticket";

const buildTicket = async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("fetches the order", async () => {
  const ticket = await buildTicket();

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("return an error if one user tries to fetch another users order", async () => {
  const ticket = await buildTicket();

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signin())
    .expect(401);
});
