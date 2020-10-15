import { IEventHandler } from 'core';
import { BalanceCreatedFailEvent, BalanceCreatedRollbackEvent } from '@sc/events';
import { BalanceRepository } from '../../repositories';

export class BalanceCreatedFailEventHandler implements IEventHandler {
  event = [BalanceCreatedFailEvent, BalanceCreatedRollbackEvent];
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async handle(event: BalanceCreatedFailEvent | BalanceCreatedRollbackEvent) {
    await this._balanceRepository.delete(event.balance.getId());
  }
}
