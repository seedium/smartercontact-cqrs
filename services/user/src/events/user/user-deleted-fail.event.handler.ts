import { UserDeletedFailEvent } from '@sc/events';
import { IEventHandler } from 'core';
import { UserRepository } from '../../repositories';

export class UserDeletedFailEventHandler implements IEventHandler {
  public event = UserDeletedFailEvent;
  constructor(private readonly _userRepository: UserRepository) {}
  public async handle(event: UserDeletedFailEvent) {
    await this._userRepository.delete(event.user.getId());
  }
  public async onFail() {
    console.error(`Fail ${UserDeletedFailEvent.name} event`);
  }
}
