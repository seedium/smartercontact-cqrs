import { ICommandHandler, EventPublisher } from 'core';
import { UserCreateCommand } from '../impl';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

export class UserCreateCommandHandler implements ICommandHandler {
  public command = UserCreateCommand;
  constructor(
    private _eventPublisher: EventPublisher,
    private _userRepository: UserRepository,
  ) {}
  public async execute(command: UserCreateCommand): Promise<void> {
    const isUserExists = await this._userRepository.emailExists(command.user.email);
    if (isUserExists) {
      throw new Error('Email is already exists');
    }
    const user: User = this._eventPublisher.mergeObjectContext(new User(command.user));
    await user.create();
  }
}
