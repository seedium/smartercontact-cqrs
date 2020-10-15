import { EventPublisher, IEventHandler } from 'core';
import { BalanceCreatedEvent } from '@sc/events';
import { BalanceRepository } from '../../repositories';
import { Balance } from '../../models';

export class BalanceCreatedEventHandler implements IEventHandler {
  event = BalanceCreatedEvent;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async handle(event: BalanceCreatedEvent) {
    await this._balanceRepository.create(event.balance);
  }
  public async onFail(event: BalanceCreatedEvent) {
    const balance = this._eventPublisher.mergeObjectContext(
      new Balance(event.balance),
    );
    await balance.createFail();
  }
}
