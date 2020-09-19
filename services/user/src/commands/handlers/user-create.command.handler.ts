import { ICommandHandler, EventPublisher } from 'core';
import { User as UserProto } from 'protos/user/entities/user.entity_pb';
import { UserCreateCommand } from '../impl';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

export class UserCreateCommandHandler implements ICommandHandler<UserProto> {
  public command = UserCreateCommand;
  constructor(
    private _eventPublisher: EventPublisher,
    private _userRepository: UserRepository,
  ) {}
  public async execute(command: UserCreateCommand): Promise<UserProto> {
    const isUserExists = await this._userRepository.emailExists(command.user.getEmail());
    if (isUserExists) {
      throw new Error('Email is already exists');
    }
    const userAggregate: User = this._eventPublisher.mergeObjectContext(new User(command.user));
    await userAggregate.create();
    return userAggregate.user;
  }
}
