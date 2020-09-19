import { IEvent } from 'core';
import { Balance } from 'protos/billing/entities/balance.entity_pb';
import { BalanceCreatedEvent as BalanceCreatedEventProto } from 'protos/billing/events/balance-created.event_pb';

export class BalanceCreatedEvent implements IEvent {
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
  static fromProto(message: Uint8Array): BalanceCreatedEvent {
    const balanceCreatedEvent = BalanceCreatedEventProto.deserializeBinary(message);
    return new BalanceCreatedEvent(balanceCreatedEvent.getBalance());
  }
}
