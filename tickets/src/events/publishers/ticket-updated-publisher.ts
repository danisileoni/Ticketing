import { Publisher, Subjects, TicketUpdatedEvent } from "@dasitickets/common";

export class TicketUpdatedPubliser extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
