import { IEvent } from 'core';
import { BalanceModel as IBalance } from '../../interfaces';

export class BalanceDeletedEvent implements IEvent {
  public static event = 'billing.balance.deleted';
  public event: string;
  constructor(public readonly balance: IBalance) {
    this.event = BalanceDeletedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance);
  }
}
