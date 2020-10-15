import { EventPublisher, ICommandHandler } from 'core';
import { User as UserProto } from 'protos';
import { UserCreateRollbackCommand } from '../impl';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

export class UserCreateRollbackCommandHandler implements ICommandHandler<UserProto> {
  public command = UserCreateRollbackCommand;
  constructor(
    private _eventPublisher: EventPublisher,
    private _userRepository: UserRepository,
  ) {}
  public async execute(command: UserCreateRollbackCommand) {
    const user = await this._userRepository.retrieve(command.idUser);
    let userAggregate: User;
    if (!user) {
      userAggregate = this._eventPublisher.mergeObjectContext(
        new User(new UserProto().setId(command.idUser))
      );
    } else {
      userAggregate = this._eventPublisher.mergeObjectContext(
        new User(user),
      );
    }
    await userAggregate.createRollback();
    return userAggregate.user;
  }
}
