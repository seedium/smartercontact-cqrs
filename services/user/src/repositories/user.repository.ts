import { Collection } from 'mongodb';
import { viewDb } from '../lib';
import { User } from 'protos/user/entities/user.entity_pb';
import { UserMapper } from '../mappers';

export class UserRepository {
  private _collection: Collection;
  constructor(
    private readonly _userMapper: UserMapper,
  ) {
    this._collection = viewDb.db('cqrs_view').collection('users');
  }
  public async create(user: User): Promise<User> {
    const response = await this._collection.insertOne(this._userMapper.toObject(user));
    return this._userMapper.fromObject(response.ops[0]);
  }
  public async retrieve(idUser: string): Promise<User> {
    const user = await this._collection.findOne({ id: idUser });
    return this._userMapper.fromObject(user);
  }
  public async delete(idUser: string): Promise<void> {
    await this._collection.deleteOne({
      id: idUser,
    });
  }
  public async list(options: any): Promise<User[]> {
    const list = await this._collection.find({}, {
      limit: options.limit || 20,
    }).toArray();
    return this._userMapper.fromArray(list);
  }
  public async exists(idUser: string): Promise<boolean> {
    const user = await this._collection.findOne({ id: idUser });

    return !!user;
  }
  public async emailExists(email: string): Promise<boolean> {
    const user = await this._collection.findOne({ email });

    return !!user;
  }
}
