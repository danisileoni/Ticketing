import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@dasitickets/common";
import { queueGroupname } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly queueGroupName: string = queueGroupname;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
