import { IEventHandler } from 'core';
import { BalanceCreatedEvent } from '@sc/events';
import { BalanceRepository } from '../../repositories';

export class BalanceCreatedEventHandler implements IEventHandler {
  event = BalanceCreatedEvent;
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async handle(event: BalanceCreatedEvent) {
    await this._balanceRepository.create(event.balance);
  }
}
