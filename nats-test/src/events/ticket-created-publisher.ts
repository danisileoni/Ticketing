import { Publisher, Subjects, TicketCreatedEvent } from "@dasitickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
