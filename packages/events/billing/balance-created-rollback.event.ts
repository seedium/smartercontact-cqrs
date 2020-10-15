import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, BalanceCreatedRollbackEvent as BalanceCreatedRollbackEventProto } from 'protos';

export class BalanceCreatedRollbackEvent implements IEventPublisher, IEventSubscriber<BalanceCreatedRollbackEvent> {
  public static event = 'billing.balance-created-rollback';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = BalanceCreatedRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const balanceDeletedEvent = new BalanceCreatedRollbackEventProto();
    balanceDeletedEvent.setBalance(this.balance);
    return balanceDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): BalanceCreatedRollbackEvent {
    const balanceCreatedEvent = BalanceCreatedRollbackEventProto.deserializeBinary(message);
    return new BalanceCreatedRollbackEvent(balanceCreatedEvent.getBalance());
  }
}
