import { IEventHandler } from 'core';
import { ReserveFundsEvent } from '@sc/events';
import { BalanceRepository } from '../../repositories';

export class ReserveFundsEventHandler implements IEventHandler {
  public event = ReserveFundsEvent;
  constructor(
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async handle({ balance }: ReserveFundsEvent) {
    await this._balanceRepository.update(balance.getId(), balance);
  }
}
