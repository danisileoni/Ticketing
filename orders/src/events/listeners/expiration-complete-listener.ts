import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@dasitickets/common";
import { queueGroupname } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly queueGroupName = queueGroupname;
  readonly subject: Subjects.ExpirationComlpete = Subjects.ExpirationComlpete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      __v: order.__v!,
      ticket: {
        id: order.ticket.id.toString(),
      },
    });

    msg.ack();
  }
}
