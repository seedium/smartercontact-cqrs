import { UserDeletedEvent } from '../impl';
import { EventPublisher, IEventHandler } from 'core';
import { Balance } from '../../models';
import { BalanceRepository } from '../../repositories';

export class UserDeletedEventHandler implements IEventHandler {
  public event = UserDeletedEvent;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async handle(event: UserDeletedEvent) {
    const balance = await this._balanceRepository.retrieveByUser(event.user.id);
    if (!balance) {
      throw new Error(`Balance for user "${event.user.id}" doesn't exists`);
    }
    const balanceAggregate: Balance = this._eventPublisher.mergeObjectContext(
      new Balance(balance),
    );
    await balanceAggregate.delete();
  }
}
