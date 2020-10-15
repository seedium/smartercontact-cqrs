import { EventPublisher, IEventHandler } from 'core';
import { ContactCreatedFailEvent, ContactCreatedRollbackEvent } from '@sc/events';
import { ContactRepository } from '../../repositories';

export class ContactCreatedFailEventHandler implements IEventHandler {
  public event = [ContactCreatedFailEvent, ContactCreatedRollbackEvent];
  constructor(
    private readonly _contactRepository: ContactRepository,
    private readonly _eventPublisher: EventPublisher,
  ) {}
  public async handle(event: ContactCreatedFailEvent | ContactCreatedRollbackEvent): Promise<void> {
    const idContact = event.contact.getId();
    if (idContact) {
      await this._contactRepository.delete(idContact);
    } else {
      await this._contactRepository.deleteByUser(event.contact.getUser());
    }
  }
}
