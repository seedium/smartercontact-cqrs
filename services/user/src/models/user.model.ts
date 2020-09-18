import { AggregateRoot, MongoEventStore } from 'core';
import { commandDb } from '../lib';
import { UserCreatedEvent, UserDeletedEvent } from '../events/impl';
import { UserModel } from '../interfaces/models';
import { createUserId } from '../helpers/create-user-id';

export class User extends AggregateRoot {
  public readonly user: UserModel
  constructor(user: Partial<UserModel>) {
    super();
    const collection = commandDb.db('cqrs_command').collection('events');
    this._eventStore = new MongoEventStore(collection);
    if (!user.id) {
      user.id = createUserId();
    }
    this.user = user as UserModel;
    this._aggregateId = this.user.id;
    this._aggregateVersion = 1;
  }
  public async create(): Promise<User> {
    await this.apply(new UserCreatedEvent(this.user));
    return this;
  }
  public async delete(): Promise<void> {
    await this.apply(new UserDeletedEvent(this.user));
  }
}
