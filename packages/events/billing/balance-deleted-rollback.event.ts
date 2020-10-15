import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, BalanceDeletedRollbackEvent as BalanceDeletedRollbackEventProto } from 'protos';

export class BalanceDeletedRollbackEvent implements IEventPublisher, IEventSubscriber<BalanceDeletedRollbackEvent> {
  public static event = 'billing.balance-deleted-rollback';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = BalanceDeletedRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const balanceDeletedEvent = new BalanceDeletedRollbackEventProto();
    balanceDeletedEvent.setBalance(this.balance);
    return balanceDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): BalanceDeletedRollbackEvent {
    const balanceCreatedEvent = BalanceDeletedRollbackEventProto.deserializeBinary(message);
    return new BalanceDeletedRollbackEvent(balanceCreatedEvent.getBalance());
  }
}
