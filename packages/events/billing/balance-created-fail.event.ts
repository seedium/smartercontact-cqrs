import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, BalanceCreatedFailEvent as BalanceCreatedFailEventProto } from 'protos';

export class BalanceCreatedFailEvent implements IEventPublisher, IEventSubscriber<BalanceCreatedFailEvent> {
  public static event = 'billing.balance-created-fail';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = BalanceCreatedFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const balanceDeletedEvent = new BalanceCreatedFailEventProto();
    balanceDeletedEvent.setBalance(this.balance);
    return balanceDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): BalanceCreatedFailEvent {
    const balanceCreatedEvent = BalanceCreatedFailEventProto.deserializeBinary(message);
    return new BalanceCreatedFailEvent(balanceCreatedEvent.getBalance());
  }
}
