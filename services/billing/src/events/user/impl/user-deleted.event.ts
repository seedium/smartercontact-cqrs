import { IEventSubscriber } from 'core';
import { User, UserDeletedEvent as UserDeletedEventProto } from 'protos';

export class UserDeletedEvent implements IEventSubscriber<UserDeletedEvent> {
  public static event = 'user.user-deleted';
  public event: string;
  constructor(public readonly user: User) {
    this.event = UserDeletedEvent.event;
  }
  fromProto(message: Uint8Array): UserDeletedEvent {
    const userDeletedEvent = UserDeletedEventProto.deserializeBinary(message);
    return new UserDeletedEvent(userDeletedEvent.getUser());
  }
}
