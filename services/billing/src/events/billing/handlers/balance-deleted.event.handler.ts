import { IEventHandler } from 'core';
import { BalanceDeletedEvent } from '../impl';
import { BalanceRepository } from '../../../repositories';

export class BalanceDeletedEventHandler implements IEventHandler {
  event = BalanceDeletedEvent;
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async handle(event: BalanceDeletedEvent) {
    await this._balanceRepository.delete(event.balance.getId());
  }
}
