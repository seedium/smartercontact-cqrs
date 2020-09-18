import { Collection } from 'mongodb';
import { viewDb } from '../lib';
import { BalanceModel } from '../interfaces/models';

export class BalanceRepository {
  private _collection: Collection;
  constructor() {
    this._collection = viewDb.db('cqrs_view').collection('balances');
  }
  public async create(balance: BalanceModel): Promise<BalanceModel> {
    const result = await this._collection.insertOne(balance);
    return result.ops[0];
  }
  public async retrieve(id: string): Promise<BalanceModel> {
    return this._collection.findOne({ id });
  }
  public async retrieveByUser(idUser: string): Promise<BalanceModel> {
    return this._collection.findOne({ user: idUser });
  }
  public async delete(idBalance: string): Promise<void> {
    await this._collection.deleteOne({ id: idBalance });
  }
}
