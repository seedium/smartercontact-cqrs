import { EventPublisher, IEventHandler } from 'core';
import { Balance as BalanceProto } from 'protos';
import { UserCreatedEvent } from '@sc/events';
import { Balance } from '../../models';

export class UserCreatedEventHandler implements IEventHandler {
  public event = UserCreatedEvent;
  private _balance: Balance;
  constructor(
    private readonly _eventPublisher: EventPublisher,
  ) {}
  public async handle(event: UserCreatedEvent) {
    const balanceDto = new BalanceProto();
    balanceDto.setUser(event.user.getId());
    balanceDto.setAmount(0);
    balanceDto.setCurrency('usd');
    balanceDto.setCreated(Date.now());
    this._balance = this._eventPublisher.mergeObjectContext(
      new Balance(balanceDto),
    );
    await this._balance.create();
  }
  public async onFail(event: UserCreatedEvent) {
    return await this._balance.createFail();
  }
}
