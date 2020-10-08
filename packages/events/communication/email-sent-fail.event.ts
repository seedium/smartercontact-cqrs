import { IEventPublisher, IEventSubscriber } from 'core';
import { EmailSentResult, EmailSentFailEvent as EmailSentFailEventProto } from 'protos';

export class EmailSentFailEvent implements IEventPublisher, IEventSubscriber<EmailSentFailEvent> {
  public static event = 'communication.email-sent-fail';
  public event: string;
  constructor() {
    this.event = EmailSentFailEvent.event;
  }
  public toJson() {
    return JSON.stringify({});
  }
  toProto(): Uint8Array {
    const emailSentEvent = new EmailSentFailEventProto();
    /*emailSentEvent.setResult(this.result);*/
    return emailSentEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): EmailSentFailEvent {
    return new EmailSentFailEvent();
  }
}
