import { UserCreatedEvent } from '@sc/events';
import { EventPublisher, IEventHandler } from 'core';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

export class UserCreatedEventHandler implements IEventHandler {
  public event = UserCreatedEvent;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _userRepository: UserRepository,
  ) {}
  public async handle(event: UserCreatedEvent) {
    await this._userRepository.create(event.user);
  }
  public async onFail(event: UserCreatedEvent) {
    const user = this._eventPublisher.mergeObjectContext(
      new User(event.user),
    );
    await user.createFail();
  }
}
