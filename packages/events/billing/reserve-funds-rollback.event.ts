import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, ReserveFundsRollbackEvent as ReserveFundsRollbackEventProto } from 'protos';

export class ReserveFundsRollbackEvent implements IEventPublisher, IEventSubscriber<ReserveFundsRollbackEvent> {
  public static event = 'billing.reserve-funds-rollback';
  public event: string;
  constructor(
    public readonly balance: Balance,
  ) {
    this.event = ReserveFundsRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const reserveFundsEvent = new ReserveFundsRollbackEventProto();
    reserveFundsEvent.setBalance(this.balance);
    return reserveFundsEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): ReserveFundsRollbackEvent {
    const reserveFundsEvent = ReserveFundsRollbackEventProto.deserializeBinary(message);
    return new ReserveFundsRollbackEvent(reserveFundsEvent.getBalance());
  }
}
