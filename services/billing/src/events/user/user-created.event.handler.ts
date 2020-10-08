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
    const balanceDto = this.createSimpleDto(event.user.getId());
    this._balance = this._eventPublisher.mergeObjectContext(
      new Balance(balanceDto),
    );
    await this._balance.create();
  }
  public async onFail(event: UserCreatedEvent) {
    if (!this._balance) {
      const balanceDto = this.createSimpleDto(event.user.getId());
      this._balance = this._eventPublisher.mergeObjectContext(
        new Balance(balanceDto),
      );
    }
    return await this._balance.createFail();
  }
  private createSimpleDto(idUser: string): BalanceProto {
    const balanceDto = new BalanceProto();
    balanceDto.setUser(idUser);
    balanceDto.setAmount(0);
    balanceDto.setCurrency('usd');
    balanceDto.setCreated(Date.now());
    return balanceDto;
  }
}
