import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, BalanceCreatedEvent as BalanceCreatedEventProto } from 'protos';

export class BalanceCreatedEvent implements IEventPublisher, IEventSubscriber<BalanceCreatedEvent> {
  public static event = 'billing.balance-created';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = BalanceCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const balanceDeletedEvent = new BalanceCreatedEventProto();
    balanceDeletedEvent.setBalance(this.balance);
    return balanceDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): BalanceCreatedEvent {
    const balanceCreatedEvent = BalanceCreatedEventProto.deserializeBinary(message);
    return new BalanceCreatedEvent(balanceCreatedEvent.getBalance());
  }
}
