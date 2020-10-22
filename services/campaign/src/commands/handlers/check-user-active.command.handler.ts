import { ICommandHandler } from 'core';
import { CheckUserActiveCommand } from '../impl';
import { UserService } from '../../services';

export class CheckUserActiveCommandHandler implements ICommandHandler {
  public command = CheckUserActiveCommand;
  constructor(
    private readonly _userService: UserService,
  ) {
  }
  public async execute(command: CheckUserActiveCommand) {
    const isUserActive = await this._userService.isUserActive(command.idUser);
    if (!isUserActive) {
      throw new Error('User is not active');
    }
    return isUserActive;
  }
}
