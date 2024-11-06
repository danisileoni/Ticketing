import { Listener, OrderCreatedEvent, Subjects } from "@dasitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = new Order({
      _id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      __v: data.__v,
    });

    await order.save();

    msg.ack();
  }
}
