import { BalanceCreatedFailEvent } from '@sc/events';
import { IEventHandler } from 'core';

export class BalanceCreatedFailEventHandler implements IEventHandler {
  public event = BalanceCreatedFailEvent;
  constructor() {}
  public async handle(event: BalanceCreatedFailEvent) {}
  public async onFail() {
    console.error(`Fail ${BalanceCreatedFailEvent.name} event`);
  }
}
