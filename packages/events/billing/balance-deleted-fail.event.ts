import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, BalanceDeletedFailEvent as BalanceDeletedFailEventProto } from 'protos';

export class BalanceDeletedFailEvent implements IEventPublisher, IEventSubscriber<BalanceDeletedFailEvent> {
  public static event = 'billing.balance-deleted-fail';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = BalanceDeletedFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const balanceDeletedEvent = new BalanceDeletedFailEventProto();
    balanceDeletedEvent.setBalance(this.balance);
    return balanceDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): BalanceDeletedFailEvent {
    const balanceCreatedEvent = BalanceDeletedFailEventProto.deserializeBinary(message);
    return new BalanceDeletedFailEvent(balanceCreatedEvent.getBalance());
  }
}
