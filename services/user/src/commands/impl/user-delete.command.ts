import { Command } from 'core';

export class UserDeleteCommand extends Command {
  public command = 'user.deleted';
  constructor(public readonly idUser: string) {
    super();
  }
}
