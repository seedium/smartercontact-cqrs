import { IEvent } from 'core';

export class UserCreatedEvent implements IEvent {
  public static event = 'user.user-created';
  public event: string;
  constructor(public readonly user: any) {
    this.event = UserCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user);
  }
}
