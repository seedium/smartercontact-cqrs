import { IEventHandler } from 'core';
import { BalanceDeletedEvent, BalanceDeletedFailEvent } from '@sc/events';
import { BalanceRepository } from '../../repositories';

export class BalanceDeletedEventHandler implements IEventHandler {
  event = BalanceDeletedEvent;
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async handle(event: BalanceDeletedEvent) {
    await this._balanceRepository.delete(event.balance.getId());
  }
  public async onFail(event: BalanceDeletedEvent) {
    return new BalanceDeletedFailEvent(event.balance);
  }
}
