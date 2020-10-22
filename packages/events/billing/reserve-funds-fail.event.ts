import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, ReserveFundsFailEvent as ReserveFundsFailEventProto } from 'protos';

export class ReserveFundsFailEvent implements IEventPublisher, IEventSubscriber<ReserveFundsFailEvent> {
  public static event = 'billing.reserve-funds-fail';
  public event: string;
  constructor(
    public readonly balance: Balance,
  ) {
    this.event = ReserveFundsFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const reserveFundsEvent = new ReserveFundsFailEventProto();
    reserveFundsEvent.setBalance(this.balance);
    return reserveFundsEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): ReserveFundsFailEvent {
    const reserveFundsEvent = ReserveFundsFailEventProto.deserializeBinary(message);
    return new ReserveFundsFailEvent(reserveFundsEvent.getBalance());
  }
}
