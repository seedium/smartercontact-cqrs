import { Collection } from 'mongodb';
import { viewDb } from '../lib';
import { UserModel } from '../interfaces/models';

export class UserRepository {
  private _collection: Collection;
  constructor() {
    this._collection = viewDb.db('cqrs_view').collection('users');
  }
  public async create(user: UserModel): Promise<UserModel> {
    const response = await this._collection.insertOne(user);
    return response.ops[0];
  }
  public async retrieve(idUser: string): Promise<UserModel> {
    return this._collection.findOne({ id: idUser });
  }
  public async delete(idUser: string): Promise<void> {
    await this._collection.deleteOne({
      id: idUser,
    });
  }
  public async list(options: any): Promise<UserModel[]> {
    return this._collection.find({}, {
      limit: options.limit || 20,
    }).toArray();
  }
  public async exists(idUser: string): Promise<boolean> {
    const user = this._collection.findOne({ id: idUser });

    return !!user;
  }
  public async emailExists(email: string): Promise<boolean> {
    const user = await this._collection.findOne({ email });

    return !!user;
  }
}
