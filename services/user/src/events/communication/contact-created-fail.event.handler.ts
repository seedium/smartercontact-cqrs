import { ContactCreatedFailEvent } from '@sc/events';
import { IEventHandler } from 'core';

export class ContactCreatedFailEventHandler implements IEventHandler {
  public event = ContactCreatedFailEvent;
  constructor() {}
  public async handle(event: ContactCreatedFailEvent) {}
  public async onFail() {
    console.error(`Fail ${ContactCreatedFailEvent.name} event`);
  }
}
