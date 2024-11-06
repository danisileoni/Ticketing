import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@dasitickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComlpete = Subjects.ExpirationComlpete;
}
