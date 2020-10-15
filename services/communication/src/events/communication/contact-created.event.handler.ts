import { EventPublisher, IEventHandler } from 'core';
import { ContactCreatedEvent, ContactCreatedFailEvent } from '@sc/events';
import { ContactRepository } from '../../repositories';
import { Contact } from '../../models';

export class ContactCreatedEventHandler implements IEventHandler<ContactCreatedEvent> {
  public event = ContactCreatedEvent;
  constructor(
    private readonly _contactRepository: ContactRepository,
    private readonly _eventPublisher: EventPublisher,
  ) {}
  public async handle(event: ContactCreatedEvent): Promise<void> {
    await this._contactRepository.create(event.contact);
  }
  public async onFail(event: ContactCreatedEvent) {
    const contact = this._eventPublisher.mergeObjectContext(
      new Contact(event.contact),
    );
    await contact.createFail();
    return new ContactCreatedFailEvent(event.contact);
  }
}
