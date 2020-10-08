import { UserCreatedFailEvent } from '@sc/events';
import { IEventHandler } from 'core';
import { UserRepository } from '../../repositories';

export class UserCreatedFailEventHandler implements IEventHandler {
  public event = UserCreatedFailEvent;
  constructor(private readonly _userRepository: UserRepository) {}
  public async handle(event: UserCreatedFailEvent) {
    await this._userRepository.delete(event.user.getId());
  }
  public async onFail() {
    console.error(`Fail ${UserCreatedFailEvent.name} event`);
  }
}
