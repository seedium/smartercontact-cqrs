import { Collection } from 'mongodb';
import { AggregateRoot } from 'core';
import { v4 } from 'uuid';
import { commandDb } from '../lib';
import { BalanceCreatedEvent, BalanceDeletedEvent } from '../events/impl';
import { BalanceModel as IBalance } from '../interfaces';
import { createBalanceId } from '../helpers/create-balance-id';

export class Balance extends AggregateRoot {
  public readonly balance: IBalance;
  private readonly _id: string;
  private _collection: Collection;
  public init() {
    this._collection = commandDb.db('cqrs_command').collection('events');
  }
  constructor(balance: Partial<IBalance>) {
    super();
    this._id = v4();
    this.init();
    if (!balance.id) {
      balance.id = createBalanceId();
    }
    this.balance = balance as IBalance;
  }
  public async create(): Promise<Balance> {
    await this._collection.insertOne({
      aggregateId: this._id,
      aggregateVersion: 1,
      payload: this.balance,
    });
    await this.apply(new BalanceCreatedEvent(this.balance));
    return this;
  }
  public async delete(): Promise<void> {
    await this._collection.insertOne({
      aggregateId: this._id,
      aggregateVersion: 1,
      payload: this.balance,
    });
    await this.apply(new BalanceDeletedEvent(this.balance));
  }
}
