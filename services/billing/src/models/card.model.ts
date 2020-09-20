import { AggregateRoot, MongoEventStore } from 'core';
import { commandDb } from '../lib';
import { CardCreatedEvent } from '../events/billing/impl';
import type { Card as CardProto } from 'protos/billing/entities/card.entity_pb';
import { createCardId } from '../helpers/create-card-id';

export class Card extends AggregateRoot {
  constructor(public readonly card: CardProto) {
    super();
    const collection = commandDb.db('cqrs_command').collection('events');
    this._eventStore = new MongoEventStore(collection);
    this._aggregateId = this.card.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Card> {
    const idCard = createCardId();
    this._aggregateId = idCard;
    this.card.setId(idCard);
    await this.apply(new CardCreatedEvent(this.card));
    return this;
  }
}
