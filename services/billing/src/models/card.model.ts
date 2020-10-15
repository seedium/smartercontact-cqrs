import { CardCreatedEvent, CardCreatedFailEvent, CardCreatedRollbackEvent } from '@sc/events';
import { AggregateRoot } from 'core';
import type { Card as CardProto } from 'protos';
import { createCardId } from '../helpers/create-card-id';

export class Card extends AggregateRoot {
  constructor(public readonly card: CardProto) {
    super();
    this._aggregateId = this.card.getId();
    this._aggregateVersion = 1;
  }
  public async create() {
    this.card.setId(this.card.getId() || createCardId());
    this._aggregateId = this.card.getId();
    return await this.apply(new CardCreatedEvent(this.card));
  }
  public async createFail() {
    return await this.apply(new CardCreatedFailEvent(this.card));
  }
  public async createRollback() {
    return await this.apply(new CardCreatedRollbackEvent(this.card));
  }
}
