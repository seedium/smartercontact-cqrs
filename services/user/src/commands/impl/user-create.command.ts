import { Command } from 'core';
import { UserModel } from '../../interfaces/models';

export class UserCreateCommand extends Command {
  public command = 'user.created';
  constructor(public readonly user: UserModel) {
    super();
  }
  public toJson(): string {
    return JSON.stringify(this.user);
  }
}
