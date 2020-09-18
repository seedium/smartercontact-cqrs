import { UserCreatedEvent } from '../impl';
import { EventPublisher, IEventHandler } from 'core';
import { Balance } from '../../../models';

export class UserCreatedEventHandler implements IEventHandler {
  public event = UserCreatedEvent;
  constructor(
    private readonly _eventPublisher: EventPublisher,
  ) {}
  public async handle(event: UserCreatedEvent) {
    const balance: Balance = this._eventPublisher.mergeObjectContext(
      new Balance({
        user: event.user.id,
        currency: 'usd',
        amount: 0,
        created: Date.now(),
      }),
    );
    await balance.create();
  }
}
