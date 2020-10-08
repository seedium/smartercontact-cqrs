import { UserDeletedEvent, UserDeletedFailEvent } from '@sc/events';
import { IEventHandler } from 'core';
import { UserRepository } from '../../repositories';

export class UserDeletedEventHandler implements IEventHandler {
  public event = UserDeletedEvent;
  constructor(private readonly _userRepository: UserRepository) {}
  public async handle(event: UserDeletedEvent) {
    await this._userRepository.delete(event.user.getId());
  }
  public async onFail(event: UserDeletedEvent) {
    return new UserDeletedFailEvent(event.user);
  }
}
