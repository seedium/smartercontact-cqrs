import { Collection } from 'mongodb';
import { Card } from 'protos';
import { CardMapper } from 'mappers';
import { viewDb } from '../lib';

export class CardRepository {
  private _collection: Collection;
  constructor(
    private readonly _cardMapper: CardMapper,
  ) {
    this._collection = viewDb.db('cqrs_view').collection('cards');
  }
  public async create(card: Card): Promise<Card> {
    const cardDto = this._cardMapper.toObject(card);
    const result = await this._collection.insertOne(cardDto);
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
  public async listByUser(idUser: string): Promise<Card[]> {
    const list = await this._collection.find({
      user: idUser,
    }).toArray();
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
