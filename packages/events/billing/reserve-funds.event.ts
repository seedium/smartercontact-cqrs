import { IEventPublisher, IEventSubscriber } from 'core';
import { Balance, ReserveFundsEvent as ReserveFundsEventProto } from 'protos';

export class ReserveFundsEvent implements IEventPublisher, IEventSubscriber<ReserveFundsEvent> {
  public static event = 'billing.reserve-funds';
  public event: string;
  constructor(public readonly balance: Balance) {
    this.event = ReserveFundsEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.balance.toObject());
  }
  toProto(): Uint8Array {
    const reserveFundsEvent = new ReserveFundsEventProto();
    reserveFundsEvent.setBalance(this.balance);
    return reserveFundsEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): ReserveFundsEvent {
    const reserveFundsEvent = ReserveFundsEventProto.deserializeBinary(message);
    return new ReserveFundsEvent(reserveFundsEvent.getBalance());
  }
}
