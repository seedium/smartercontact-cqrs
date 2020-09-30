import { IEventPublisher, IEventSubscriber } from 'core';
import { Card, CardCreatedEvent as CardCreatedEventProto } from 'protos';

export class CardCreatedEvent implements IEventPublisher, IEventSubscriber<CardCreatedEvent> {
  public static event = 'billing.card-created';
  public event: string;
  constructor(public readonly card: Card) {
    this.event = CardCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.card.toObject());
  }
  toProto(): Uint8Array {
    const cardCreatedEvent = new CardCreatedEventProto();
    cardCreatedEvent.setCard(this.card);
    return cardCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CardCreatedEvent {
    const cardCreatedEvent = CardCreatedEventProto.deserializeBinary(message);
    return new CardCreatedEvent(cardCreatedEvent.getCard());
  }
}
