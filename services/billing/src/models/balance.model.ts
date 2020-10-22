import { v4 } from 'uuid';
import {
  BalanceCreatedEvent,
  BalanceCreatedFailEvent,
  BalanceCreatedRollbackEvent,
  BalanceDeletedEvent,
  BalanceDeletedFailEvent,
  ReserveFundsEvent,
  ReserveFundsFailEvent,
  ReserveFundsRollbackEvent,
} from '@sc/events';
import { AggregateRoot, IEventPublisher } from 'core';
import { Balance as BalanceProto } from 'protos';
import { createBalanceId } from '../helpers/create-balance-id';

export class Balance extends AggregateRoot {
  constructor(public readonly balance: BalanceProto, transactionId = v4()) {
    super(transactionId);
    this._aggregateId = this.balance.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Balance> {
    this.balance.setId(createBalanceId());
    this._aggregateId = this.balance.getId();
    await this.apply(new BalanceCreatedEvent(this.balance));
    return this;
  }
  public async createFail(): Promise<IEventPublisher> {
    return await this.apply(new BalanceCreatedFailEvent(this.balance));
  }
  public async createRollback(): Promise<IEventPublisher> {
    return await this.apply(new BalanceCreatedRollbackEvent(this.balance));
  }
  public async delete(): Promise<void> {
    await this.apply(new BalanceDeletedEvent(this.balance));
  }
  public async deleteFail(): Promise<void> {
    await this.apply(new BalanceDeletedFailEvent(this.balance));
  }
  public async reserveFunds(): Promise<void> {
    await this.apply(new ReserveFundsEvent(this.balance));
  }
  public async reserveFundsFail(): Promise<void> {
    await this.apply(new ReserveFundsFailEvent(this.balance));
  }
  public async reserveFundsRollback(): Promise<void> {
    await this.apply(new ReserveFundsRollbackEvent(this.balance));
  }
}
