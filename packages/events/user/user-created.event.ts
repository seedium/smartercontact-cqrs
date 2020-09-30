import { IEventSubscriber, IEventPublisher } from 'core';
import { User, UserCreatedEvent as UserCreatedEventProto } from 'protos';

export class UserCreatedEvent implements IEventPublisher, IEventSubscriber<UserCreatedEvent> {
  public static event = 'user.user-created';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user.toObject());
  }
  toProto(): Uint8Array {
    const userCreatedEvent = new UserCreatedEventProto();
    userCreatedEvent.setUser(this.user);
    return userCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): UserCreatedEvent {
    const userCreatedEvent = UserCreatedEventProto.deserializeBinary(message);
    return new UserCreatedEvent(userCreatedEvent.getUser());
  }
}
