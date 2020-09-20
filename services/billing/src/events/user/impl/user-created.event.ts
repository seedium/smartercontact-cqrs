import { IEventSubscriber } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';
import { UserCreatedEvent as UserCreatedEventProto } from 'protos/user/events/user-created.event_pb';

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
