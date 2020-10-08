import { UserCreatedEvent, UserDeletedEvent, UserCreatedFailEvent } from '@sc/events';
import { AggregateRoot } from 'core';
import { User as UserProto } from 'protos';
import { createUserId } from '../helpers/create-user-id';

export class User extends AggregateRoot {
  constructor(public readonly user: UserProto) {
    super();
    this.user.setId(this.user.getId() || createUserId());
    this._aggregateId = this.user.getId();
    this._aggregateVersion = 1;
  }
  public async create(): Promise<User> {
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
