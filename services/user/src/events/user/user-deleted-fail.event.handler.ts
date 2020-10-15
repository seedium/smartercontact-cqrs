import { UserDeletedFailEvent, UserDeletedRollbackEvent } from '@sc/events';
import { IEventHandler } from 'core';
import { UserRepository } from '../../repositories';

export class UserDeletedFailEventHandler implements IEventHandler {
  public event = [UserDeletedFailEvent, UserDeletedRollbackEvent];
  constructor(private readonly _userRepository: UserRepository) {}
  public async handle(event: UserDeletedFailEvent | UserDeletedRollbackEvent) {
    console.log(`Cannot to recreate deleted user`);
  }
  public async onFail() {
    console.error(`Fail ${UserDeletedFailEvent.name} event`);
  }
}
