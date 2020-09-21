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
  public async create(card: Card): Promise<Card> {
    const result = await this._collection.insertOne(this._cardMapper.toObject(card));
    return this._cardMapper.fromObject(result.ops[0]);
  }
  public async retrieve(idCard: string): Promise<Card> {
    const result = await this._collection.findOne({ id: idCard });
    return this._cardMapper.fromObject(result);
  }
  public async list(options = {}): Promise<Card[]> {
    const list = await this._collection.find(options).toArray();
    return this._cardMapper.fromArray(list);
  }
  public async delete(idCard: string): Promise<void> {
    await this._collection.deleteOne({ id: idCard });
  }
  public async isCardNumberExists(cardNumber: string): Promise<boolean> {
    const card = await this._collection.findOne({
      card_number: cardNumber,
    });
    return !!card;
  }
}
