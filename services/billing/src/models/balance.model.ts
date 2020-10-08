import { BalanceCreatedEvent, BalanceDeletedEvent, BalanceCreatedFailEvent, BalanceDeletedFailEvent } from '@sc/events';
import { AggregateRoot, IEventPublisher } from 'core';
import { Balance as BalanceProto } from 'protos';
import { createBalanceId } from '../helpers/create-balance-id';

export class Balance extends AggregateRoot {
  constructor(public readonly balance: BalanceProto) {
    super();
    this.balance.setId(this.balance.getId() || createBalanceId());
    this._aggregateId = this.balance.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Balance> {
    await this.apply(new BalanceCreatedEvent(this.balance));
    return this;
  }
  public async createFail(): Promise<IEventPublisher> {
    return await this.apply(new BalanceCreatedFailEvent(this.balance));
  }
  public async delete(): Promise<void> {
    await this.apply(new BalanceDeletedEvent(this.balance));
  }
  public async deleteFail(): Promise<void> {
    await this.apply(new BalanceDeletedFailEvent(this.balance));
  }
}
