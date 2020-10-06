import { Command } from 'core';

export class UserCreateRollbackCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
