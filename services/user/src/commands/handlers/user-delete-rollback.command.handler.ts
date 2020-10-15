import { EventPublisher, ICommandHandler } from 'core';
import { User as UserProto } from 'protos';
import { UserDeleteRollbackCommand } from '../impl';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

export class UserDeleteRollbackCommandHandler implements ICommandHandler<UserProto> {
  public command = UserDeleteRollbackCommand;
  constructor(
    private _eventPublisher: EventPublisher,
    private _userRepository: UserRepository,
  ) {}
  public async execute(command: UserDeleteRollbackCommand) {
    const user = await this._userRepository.retrieve(command.idUser);
    if (!user) {
      return;
    }
    const userAggregate: User = this._eventPublisher.mergeObjectContext(new User(user));
    await userAggregate.deleteRollback();
    return userAggregate.user;
  }
}
