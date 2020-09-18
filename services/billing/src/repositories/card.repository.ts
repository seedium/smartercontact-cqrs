import { Collection } from 'mongodb';
import { viewDb } from '../lib';
import { ICardModel } from '../interfaces/models';

export class CardRepository {
  private _collection: Collection;
  constructor() {
    this._collection = viewDb.db('cqrs_view').collection('cards');
  }
  public async list(options = {}): Promise<ICardModel[]> {
    return this._collection.find(options).toArray();
  }
}
