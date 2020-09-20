import { IEventSubscriber } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';
import { UserDeletedEvent as UserDeletedEventProto } from 'protos/user/events/user-deleted.event_pb';

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
