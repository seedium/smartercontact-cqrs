import { IEventSubscriber, IEventPublisher } from 'core';
import { User, UserCreatedRollbackEvent as UserCreatedRollbackEventProto } from 'protos';

export class UserCreatedRollbackEvent implements IEventPublisher, IEventSubscriber<UserCreatedRollbackEvent> {
  public static event = 'user.user-created-rollback';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserCreatedRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user.toObject());
  }
  toProto(): Uint8Array {
    const userCreatedEvent = new UserCreatedRollbackEventProto();
    userCreatedEvent.setUser(this.user);
    return userCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): UserCreatedRollbackEvent {
    const userCreatedEvent = UserCreatedRollbackEventProto.deserializeBinary(message);
    return new UserCreatedRollbackEvent(userCreatedEvent.getUser());
  }
}
