import { IEventHandler } from 'core';
import { ReserveFundsFailEvent, ReserveFundsRollbackEvent } from '@sc/events';
import { BalanceRepository } from '../../repositories';

export class ReserveFundsFailEventHandler implements IEventHandler {
  public event = [ReserveFundsFailEvent, ReserveFundsRollbackEvent];
  constructor(
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async handle({ balance }: ReserveFundsFailEvent | ReserveFundsRollbackEvent) {
    await this._balanceRepository.update(balance.getId(), balance);
  }
}
