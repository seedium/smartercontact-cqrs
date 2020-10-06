import { BalanceCreatedEvent, BalanceDeletedEvent, BalanceCreatedFailEvent } from '@sc/events';
import { AggregateRoot, IEventPublisher, MongoEventStore } from 'core';
import { Balance as BalanceProto } from 'protos';
import { commandDb } from '../lib';
import { createBalanceId } from '../helpers/create-balance-id';

export class Balance extends AggregateRoot {
  constructor(public readonly balance: BalanceProto) {
    super();
    const collection = commandDb.db('cqrs_command').collection('events');
    this._eventStore = new MongoEventStore(collection);
    this._aggregateId = this.balance.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Balance> {
    const idBalance = createBalanceId();
    this._aggregateId = idBalance;
    this.balance.setId(idBalance);
    await this.apply(new BalanceCreatedEvent(this.balance));
    return this;
  }
  public async createFail(): Promise<IEventPublisher> {
    return await this.apply(new BalanceCreatedFailEvent(this.balance));
  }
  public async delete(): Promise<void> {
    await this.apply(new BalanceDeletedEvent(this.balance));
  }
}
