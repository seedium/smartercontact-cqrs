import { UserDeletedEvent } from '@sc/events';
import { IEventHandler } from 'core';

export class UserDeletedEventHandler implements IEventHandler {
  public event = UserDeletedEvent;
  constructor() {}
  public async handle() {}
}
