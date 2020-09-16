import { Collection } from 'mongodb';
import { AggregateRoot } from 'core';
import { v4 } from 'uuid';
import { commandDb } from '../lib';
import { UserCreatedEvent } from '../events/impl';

export class User extends AggregateRoot {
  private readonly _id: string;
  private _collection: Collection;
  public init() {
    this._collection = commandDb.db('cqrs_command').collection('events');
  }
  constructor(public readonly user: any) {
    super();
    this._id = v4();
    this.init();
  }
  public async create() {
    await this._collection.insertOne({
      aggregateId: this._id,
      aggregateVersion: 1,
      payload: this.user,
    });
    await this.apply(new UserCreatedEvent(this.user));
  }
  public async update() {
    await this._collection.insertOne({
      aggregateId: this._id,
      aggregateVersion: 1,
      payload: this.user,
    });
  }
}
