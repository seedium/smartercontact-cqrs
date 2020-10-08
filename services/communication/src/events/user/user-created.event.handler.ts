import { UserCreatedEvent } from '@sc/events';
import { IEventHandler } from 'core';

export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  public event = UserCreatedEvent;
  public async handle() {}
}
