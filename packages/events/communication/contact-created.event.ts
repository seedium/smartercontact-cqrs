import { IEventPublisher, IEventSubscriber } from 'core';
import { Contact, ContactCreatedEvent as ContactCreatedEventProto } from 'protos';

export class ContactCreatedEvent implements IEventPublisher, IEventSubscriber<ContactCreatedEvent> {
  public static event = 'communication.contact-created';
  public event: string;
  constructor(public readonly contact: Contact) {
    this.event = ContactCreatedEvent.event;
  }
  public toJson() {
    return JSON.stringify(this.contact.toObject());
  }
  toProto(): Uint8Array {
    const contactCreated = new ContactCreatedEventProto();
    contactCreated.setContact(this.contact);
    return contactCreated.serializeBinary();
  }
  fromProto(message: Uint8Array): ContactCreatedEvent {
    const emailSentEvent = ContactCreatedEventProto.deserializeBinary(message);
    return new ContactCreatedEvent(emailSentEvent.getContact());
  }
}
