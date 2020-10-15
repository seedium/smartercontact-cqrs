import { IEventHandler } from 'core';
import { UserCreatedFailEvent, UserCreatedRollbackEvent } from '@sc/events';

export class UserCreatedFailEventHandler implements IEventHandler {
  public event = [UserCreatedFailEvent, UserCreatedRollbackEvent];
  public async handle() {}
}
