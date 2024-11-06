import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { Listener, Subjects, TicketCreatedEvent } from "@dasitickets/common";
import { queueGroupname } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly queueGroupName: string = queueGroupname;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;
    const ticket = new Ticket({
      _id: id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
