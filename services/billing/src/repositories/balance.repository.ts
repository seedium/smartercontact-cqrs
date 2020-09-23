import { Collection } from 'mongodb';
import { Balance } from 'protos';
import { BalanceMapper } from 'mappers';
import { viewDb } from '../lib';

export class BalanceRepository {
  private _collection: Collection;
  constructor(
    private readonly _balanceMapper: BalanceMapper,
  ) {
    this._collection = viewDb.db('cqrs_view').collection('balances');
  }
  public async create(balance: Balance): Promise<Balance> {
    const balanceDto = this._balanceMapper.toObject(balance);
    const result = await this._collection.insertOne(balanceDto);
    return this._balanceMapper.fromObject(result.ops[0]);
  }
  public async retrieve(id: string): Promise<Balance> {
    const balance = await this._collection.findOne({ id });
    return this._balanceMapper.fromObject(balance);
  }
  public async retrieveByUser(idUser: string): Promise<Balance> {
    const balance = await this._collection.findOne({ user: idUser });
    return this._balanceMapper.fromObject(balance);
  }
  public async delete(idBalance: string): Promise<void> {
    await this._collection.deleteOne({ id: idBalance });
  }
}
