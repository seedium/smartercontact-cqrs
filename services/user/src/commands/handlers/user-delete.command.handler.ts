import { ICommandHandler, EventPublisher } from 'core';
import { User as UserProto } from 'protos';
import { UserDeleteCommand } from '../impl';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

export class UserDeleteCommandHandler implements ICommandHandler {
  public command = UserDeleteCommand;
  constructor(
    private _eventPublisher: EventPublisher,
    private _userRepository: UserRepository,
  ) {}
  public async execute(command: UserDeleteCommand): Promise<void> {
    const user = await this._userRepository.retrieve(command.idUser);
    if (!user) {
      throw new Error(`The user "${command.idUser}" doesn't exists`);
    }
    const userAggregate = this._eventPublisher.mergeObjectContext(
      new User(user),
    );
    await userAggregate.delete();
  }
  public async onFail(command: UserDeleteCommand): Promise<void> {
    const userAggregate = this._eventPublisher.mergeObjectContext(
      new User(new UserProto().setId(command.idUser)),
    );
    await userAggregate.deleteFail();
  }
}
