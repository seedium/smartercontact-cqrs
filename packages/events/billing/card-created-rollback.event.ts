import { IEventPublisher, IEventSubscriber } from 'core';
import { Card, CardCreatedRollbackEvent as CardCreatedRollbackEventProto } from 'protos';

export class CardCreatedRollbackEvent implements IEventPublisher, IEventSubscriber<CardCreatedRollbackEvent> {
  public static event = 'billing.card-created-rollback';
  public event: string;
  constructor(public readonly card: Card) {
    this.event = CardCreatedRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.card.toObject());
  }
  toProto(): Uint8Array {
    const cardCreatedEvent = new CardCreatedRollbackEventProto();
    cardCreatedEvent.setCard(this.card);
    return cardCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CardCreatedRollbackEvent {
    const cardCreatedEvent = CardCreatedRollbackEventProto.deserializeBinary(message);
    return new CardCreatedRollbackEvent(cardCreatedEvent.getCard());
  }
}
