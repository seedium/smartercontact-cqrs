import { Collection } from 'mongodb';
import { viewDb } from '../lib';
import { Card } from 'protos/billing/entities/card.entity_pb';
import { CardMapper } from '../mappers';

export class CardRepository {
  private _collection: Collection;
  constructor(
    private readonly _cardMapper: CardMapper,
  ) {
    this._collection = viewDb.db('cqrs_view').collection('cards');
  }
  public async list(options = {}): Promise<Card[]> {
    const list = await this._collection.find(options).toArray();
    return this._cardMapper.fromArray(list);
  }
}
