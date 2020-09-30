import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, BalanceDeletedEvent as BalanceDeletedEventProto } from 'protos';

export class BalanceDeletedEvent implements IEventPublisher, IEventSubscriber<BalanceDeletedEvent> {
  public static event = 'billing.balance-deleted';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = BalanceDeletedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const balanceDeletedEvent = new BalanceDeletedEventProto();
    balanceDeletedEvent.setBalance(this.balance);
    return balanceDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): BalanceDeletedEvent {
    const balanceCreatedEvent = BalanceDeletedEventProto.deserializeBinary(message);
    return new BalanceDeletedEvent(balanceCreatedEvent.getBalance());
  }
}
