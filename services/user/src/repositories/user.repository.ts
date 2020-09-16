import { Collection } from 'mongodb';
import { viewDb } from '../lib';
import { User } from '../models';

export class UserRepository {
  private _collection: Collection;
  constructor() {
    this._collection = viewDb.db('cqrs_view').collection('users');
  }
  public async create(user: User) {
    return await this._collection.insertOne(user);
  }
  public async retrieve(idUser: string) {
    return this._collection.findOne({ _id: idUser });
  }
  public async list(options: any) {
    this._collection.find({}, {
      limit: options.limit || 20,
    });
  }
}
