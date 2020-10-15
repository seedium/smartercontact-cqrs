import { IEventPublisher, IEventSubscriber } from 'core';
import { User, UserDeletedRollbackEvent as UserDeletedRollbackEventProto } from 'protos';

export class UserDeletedRollbackEvent implements IEventPublisher, IEventSubscriber<UserDeletedRollbackEvent> {
  public static event = 'user.user-deleted-rollback';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserDeletedRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.user.toObject());
  }
  toProto(): Uint8Array {
    const userDeletedEvent = new UserDeletedRollbackEventProto();
    userDeletedEvent.setUser(this.user);
    return userDeletedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): UserDeletedRollbackEvent {
    const userDeletedEvent = UserDeletedRollbackEventProto.deserializeBinary(message);
    return new UserDeletedRollbackEvent(userDeletedEvent.getUser());
  }
}
