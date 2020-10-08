import { UserCreatedEvent, UserCreatedFailEvent } from '@sc/events';
import { IEventHandler } from 'core';
import { UserRepository } from '../../repositories';

export class UserCreatedEventHandler implements IEventHandler {
  public event = UserCreatedEvent;
  constructor(private readonly _userRepository: UserRepository) {}
  public async handle(event: UserCreatedEvent) {
    await this._userRepository.create(event.user);
  }
  public async onFail(event: UserCreatedEvent) {
    return new UserCreatedFailEvent(event.user);
  }
}
