import { AggregateRoot, MongoEventStore } from 'core';
import { commandDb } from '../lib';
import { BalanceCreatedEvent, BalanceDeletedEvent } from '../events/billing/impl';
import { BalanceModel as IBalance } from '../interfaces';
import { createBalanceId } from '../helpers/create-balance-id';

export class Balance extends AggregateRoot {
  public readonly balance: IBalance;
  constructor(balance: Partial<IBalance>) {
    super();
    const collection = commandDb.db('cqrs_command').collection('events');
    this._eventStore = new MongoEventStore(collection);
    if (!balance.id) {
      balance.id = createBalanceId();
    }
    this.balance = balance as IBalance;
    this._aggregateId = this.balance.id;
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Balance> {
    await this.apply(new BalanceCreatedEvent(this.balance));
    return this;
  }
  public async delete(): Promise<void> {
    await this.apply(new BalanceDeletedEvent(this.balance));
  }
}
