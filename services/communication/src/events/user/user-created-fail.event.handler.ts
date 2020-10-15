import { IEventHandler } from 'core';
import { UserCreatedFailEvent, UserCreatedRollbackEvent } from '@sc/events';

export class UserCreatedFailEventHandler implements IEventHandler<UserCreatedFailEvent> {
  public event = [UserCreatedFailEvent, UserCreatedRollbackEvent];
  public handle() {}
}
