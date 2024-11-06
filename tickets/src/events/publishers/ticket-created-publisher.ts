import { Publisher, Subjects, TicketCreatedEvent } from "@dasitickets/common";

export class TicketCreatedPubliser extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
