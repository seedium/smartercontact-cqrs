import { IEventPublisher, IEventSubscriber } from 'core';
import { User, UserDeletedFailEvent as UserDeletedFailEventProto } from 'protos';

export class UserDeletedFailEvent implements IEventPublisher, IEventSubscriber<UserDeletedFailEvent> {
  public static event = 'user.user-deleted-fail';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserDeletedFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user.toObject());
  }
  toProto(): Uint8Array {
    const userDeletedEvent = new UserDeletedFailEventProto();
    userDeletedEvent.setUser(this.user);
    return userDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): UserDeletedFailEvent {
    const userDeletedEvent = UserDeletedFailEventProto.deserializeBinary(message);
    return new UserDeletedFailEvent(userDeletedEvent.getUser());
  }
}
