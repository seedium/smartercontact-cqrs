import { IEventPublisher, IEventSubscriber } from 'core';
import { Contact, ContactCreatedFail as ContactCreatedFailProto } from 'protos';

export class ContactCreatedFailEvent implements IEventPublisher, IEventSubscriber<ContactCreatedFailEvent> {
  public static event = 'communication.contact-created-fail';
  public event: string;
  constructor(public readonly contact: Contact) {
    this.event = ContactCreatedFailEvent.event;
  }
  public toJson() {
    return JSON.stringify(this.contact.toObject());
  }
  toProto(): Uint8Array {
    const contactCreated = new ContactCreatedFailProto();
    contactCreated.setContact(this.contact);
    return contactCreated.serializeBinary();
  }
  fromProto(message: Uint8Array): ContactCreatedFailEvent {
    const emailSentEvent = ContactCreatedFailProto.deserializeBinary(message);
    return new ContactCreatedFailEvent(emailSentEvent.getContact());
  }
}
