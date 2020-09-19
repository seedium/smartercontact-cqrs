import { UserDeletedEvent } from '../impl';
import { IEventHandler } from 'core';
import { UserRepository } from '../../repositories';

export class UserDeletedEventHandler implements IEventHandler {
  public event = UserDeletedEvent;
  constructor(private readonly _userRepository: UserRepository) {}
  public async handle(event: UserDeletedEvent) {
    await this._userRepository.delete(event.user.getId());
  }
}
