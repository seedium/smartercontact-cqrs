import { BalanceCreatedEvent } from '@sc/events';
import { IEventHandler } from 'core';

export class BalanceCreatedEventHandler implements IEventHandler<BalanceCreatedEvent> {
  public event = BalanceCreatedEvent;
  public handle() {}
}
