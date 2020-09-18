import { IEvent } from 'core';
import { UserModel } from '../../interfaces/models';

export class UserDeletedEvent implements IEvent {
  public static event = 'user.user-deleted';
  public event: string;
  constructor(public readonly user: UserModel) {
    this.event = UserDeletedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user);
  }
}
