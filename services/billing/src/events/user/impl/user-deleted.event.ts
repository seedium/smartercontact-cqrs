import { IEvent } from 'core';

export class UserDeletedEvent implements IEvent {
  public static event = 'user.user-deleted';
  public event: string;
  constructor(public readonly user: any) {
    this.event = UserDeletedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user);
  }
}
