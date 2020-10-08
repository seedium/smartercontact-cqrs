import { IEventHandler } from 'core';
import { UserCreatedEvent } from '@sc/events';

export class UserCreatedEventHandler implements IEventHandler {
  public event = UserCreatedEvent;
  public async handle() {}
}
