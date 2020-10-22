import { v4 } from 'uuid';
import { CardCreatedEvent, CardCreatedFailEvent, CardCreatedRollbackEvent } from '@sc/events';
import { AggregateRoot } from 'core';
import type { Card as CardProto } from 'protos';
import { createCardId } from '../helpers/create-card-id';

export class Card extends AggregateRoot {
  constructor(public readonly card: CardProto, transactionId = v4()) {
    super(transactionId);
    this._aggregateId = this.card.getId();
    this._aggregateVersion = 1;
  }
  public async create() {
    this.card.setId(createCardId());
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
