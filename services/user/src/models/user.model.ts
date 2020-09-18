import { Collection } from 'mongodb';
import { AggregateRoot } from 'core';
import { v4 } from 'uuid';
import { commandDb } from '../lib';
import { UserCreatedEvent, UserDeletedEvent } from '../events/impl';
import { UserModel } from '../interfaces/models';
import { createUserId } from '../helpers/create-user-id';

export class User extends AggregateRoot {
  private readonly _id: string;
  private _collection: Collection;
  public init() {
    this._collection = commandDb.db('cqrs_command').collection('events');
  }
  constructor(public readonly user: UserModel) {
    super();
    this._id = v4();
    this.init();
  }
  public async create() {
    this.user.id = createUserId();
    await this._collection.insertOne({
      aggregateId: this._id,
      aggregateVersion: 1,
      payload: this.user,
    });
    await this.apply(new UserCreatedEvent(this.user));
  }
  public async delete() {
    await this._collection.insertOne({
      aggregateId: this._id,
      aggregateVersion: 1,
      payload: this.user,
    });
    await this.apply(new UserDeletedEvent(this.user));
  }
}
