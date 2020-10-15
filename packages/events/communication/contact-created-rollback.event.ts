import { IEventPublisher, IEventSubscriber } from 'core';
import { Contact, ContactCreatedRollbackEvent as ContactCreatedRollbackEventProto } from 'protos';

export class ContactCreatedRollbackEvent implements IEventPublisher, IEventSubscriber<ContactCreatedRollbackEvent> {
  public static event = 'communication.contact-created-rollback';
  public event: string;
  constructor(public readonly contact: Contact) {
    this.event = ContactCreatedRollbackEvent.event;
  }
  public toJson() {
    return JSON.stringify(this.contact.toObject());
  }
  toProto(): Uint8Array {
    const contactCreated = new ContactCreatedRollbackEventProto();
    contactCreated.setContact(this.contact);
    return contactCreated.serializeBinary();
  }
  fromProto(message: Uint8Array): ContactCreatedRollbackEvent {
    const emailSentEvent = ContactCreatedRollbackEventProto.deserializeBinary(message);
    return new ContactCreatedRollbackEvent(emailSentEvent.getContact());
  }
}
