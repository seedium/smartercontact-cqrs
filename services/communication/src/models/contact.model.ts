import { ContactCreatedEvent, ContactCreatedFailEvent, ContactCreatedRollbackEvent } from '@sc/events';
import { AggregateRoot, IEventPublisher } from 'core';
import { Contact as ContactProto } from 'protos';
import { createContactId } from '../helpers/create-contact-id';

export class Contact extends AggregateRoot {
  constructor(public readonly contact: ContactProto) {
    super();
    this._aggregateId = this.contact.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Contact> {
    this.contact.setId(this.contact.getId() || createContactId());
    this._aggregateId = this.contact.getId();
    await this.apply(new ContactCreatedEvent(this.contact));
    return this;
  }
  public async createFail(): Promise<IEventPublisher> {
    return await this.apply(new ContactCreatedFailEvent(this.contact));
  }
  public async createRollback(): Promise<IEventPublisher> {
    return await this.apply(new ContactCreatedRollbackEvent(this.contact));
  }
}
