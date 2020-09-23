import { IEventPublisher, IEventSubscriber } from 'core';
import { User, UserDeletedEvent as UserDeletedEventProto } from 'protos';


export class UserDeletedEvent implements IEventPublisher, IEventSubscriber<UserDeletedEvent> {
  public static event = 'user.user-deleted';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserDeletedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user.toObject());
  }
  toProto(): Uint8Array {
    const userDeletedEvent = new UserDeletedEventProto();
    userDeletedEvent.setUser(this.user);
    return userDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): UserDeletedEvent {
    const userDeletedEvent = UserDeletedEventProto.deserializeBinary(message);
    return new UserDeletedEvent(userDeletedEvent.getUser());
  }
}
