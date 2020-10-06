import { IEventPublisher, IEventSubscriber } from 'core';
import { Card, CardCreatedFailEvent as CardCreatedFailEventProto } from 'protos';

export class CardCreatedFailEvent implements IEventPublisher, IEventSubscriber<CardCreatedFailEvent> {
  public static event = 'billing.card-created-fail';
  public event: string;
  constructor(public readonly card: Card) {
    this.event = CardCreatedFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.card.toObject());
  }
  toProto(): Uint8Array {
    const cardCreatedEvent = new CardCreatedFailEventProto();
    cardCreatedEvent.setCard(this.card);
    return cardCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CardCreatedFailEvent {
    const cardCreatedEvent = CardCreatedFailEventProto.deserializeBinary(message);
    return new CardCreatedFailEvent(cardCreatedEvent.getCard());
  }
}
