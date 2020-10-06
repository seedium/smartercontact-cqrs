import { UserCreatedEvent, UserDeletedEvent, UserCreatedFailEvent } from '@sc/events';
import { AggregateRoot, MongoEventStore } from 'core';
import { User as UserProto } from 'protos';
import { commandDb } from '../lib';
import { createUserId } from '../helpers/create-user-id';

export class User extends AggregateRoot {
  constructor(public readonly user: UserProto) {
    super();
    const collection = commandDb.db('cqrs_command').collection('events');
    this._eventStore = new MongoEventStore(collection);
    this._aggregateId = this.user.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<User> {
    const idUser = createUserId();
    this._aggregateId = idUser;
    this.user.setId(idUser);
    await this.apply(new UserCreatedEvent(this.user));
    return this;
  }
  public async createRollback(): Promise<void> {
    await this.apply(new UserCreatedFailEvent(this.user));
  }
  public async delete(): Promise<void> {
    await this.apply(new UserDeletedEvent(this.user));
  }
}
