import { IEventSubscriber } from 'core';
import { User, UserCreatedEvent as UserCreatedEventProto } from 'protos';

export class UserCreatedEvent implements IEventSubscriber<UserCreatedEvent> {
  public static event = 'user.user-created';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserCreatedEvent.event;
  }
  fromProto(message: Uint8Array): UserCreatedEvent {
    const userCreatedEvent = UserCreatedEventProto.deserializeBinary(message);
    return new UserCreatedEvent(userCreatedEvent.getUser());
  }
}
