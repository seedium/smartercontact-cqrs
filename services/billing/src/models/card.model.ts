import { CardCreatedEvent } from '@sc/events';
import { AggregateRoot } from 'core';
import type { Card as CardProto } from 'protos';
import { createCardId } from '../helpers/create-card-id';

export class Card extends AggregateRoot {
  constructor(public readonly card: CardProto) {
    super();
    this.card.setId(this.card.getId() || createCardId());
    this._aggregateId = this.card.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<Card> {
    await this.apply(new CardCreatedEvent(this.card));
    return this;
  }
}
