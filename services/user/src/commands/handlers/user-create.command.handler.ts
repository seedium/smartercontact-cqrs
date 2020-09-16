import { UserCreateCommand } from '../impl';
import { ICommandHandler, EventPublisher } from 'core';
import { User } from '../../models';

export class UserCreateCommandHandler implements ICommandHandler {
  public command = UserCreateCommand;
  constructor(
    private _eventPublisher: EventPublisher,
  ) {}
  public async execute(command: UserCreateCommand): Promise<void> {
    const user: User = this._eventPublisher.mergeObjectContext(new User(command.user));
    await user.create();
  }
}
