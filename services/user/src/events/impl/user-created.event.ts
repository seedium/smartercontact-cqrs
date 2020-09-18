import { IEvent } from 'core';
import { UserModel } from '../../interfaces/models';

export class UserCreatedEvent implements IEvent {
  public static event = 'user.user-created';
  public event: string;
  constructor(public readonly user: UserModel) {
    this.event = UserCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user);
  }
}
