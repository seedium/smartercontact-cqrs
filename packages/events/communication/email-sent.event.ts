import { IEventPublisher, IEventSubscriber } from 'core';
import { EmailSentResult, EmailSentEvent as EmailSentEventProto } from 'protos';

export class EmailSentEvent implements IEventPublisher, IEventSubscriber<EmailSentEvent> {
  public static event = 'communication.email-sent';
  public event: string;
  constructor(public readonly result: EmailSentResult) {
    this.event = EmailSentEvent.event;
  }
  public toJson() {
    return JSON.stringify(this.result.toObject());
  }
  toProto(): Uint8Array {
    const emailSentEvent = new EmailSentEventProto();
    emailSentEvent.setResult(this.result);
    return emailSentEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): EmailSentEvent {
    const emailSentEvent = EmailSentEventProto.deserializeBinary(message);
    return new EmailSentEvent(emailSentEvent.getResult());
  }
}
