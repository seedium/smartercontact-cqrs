import { IEvent } from 'core';
import { BalanceModel as IBalance } from '../../../interfaces';

export class BalanceCreatedEvent implements IEvent {
  public static event = 'billing.balance.created';
  public event: string;
  constructor(public readonly balance: IBalance) {
    this.event = BalanceCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance);
  }
}
