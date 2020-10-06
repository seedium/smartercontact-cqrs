import { IEventSubscriber, IEventPublisher } from 'core';
import { User, UserCreatedFailEvent as UserCreatedFailEventProto } from 'protos';

export class UserCreatedFailEvent implements IEventPublisher, IEventSubscriber<UserCreatedFailEvent> {
  public static event = 'user.user-created-fail';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserCreatedFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user.toObject());
  }
  toProto(): Uint8Array {
    const userCreatedEvent = new UserCreatedFailEventProto();
    userCreatedEvent.setUser(this.user);
    return userCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): UserCreatedFailEvent {
    const userCreatedEvent = UserCreatedFailEventProto.deserializeBinary(message);
    return new UserCreatedFailEvent(userCreatedEvent.getUser());
  }
}
