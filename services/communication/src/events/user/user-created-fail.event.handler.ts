import { IEventHandler } from 'core';
import { UserCreatedFailEvent } from '@sc/events';

export class UserCreatedFailEventHandler implements IEventHandler<UserCreatedFailEvent> {
  public event = UserCreatedFailEvent;
  public handle() {}
}
