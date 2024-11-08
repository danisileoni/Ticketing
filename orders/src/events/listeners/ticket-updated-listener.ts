import { Listener, Subjects, TicketUpdatedEvent } from "@dasitickets/common";
import { queueGroupname } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupname;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      __v: data.__v - 1,
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
