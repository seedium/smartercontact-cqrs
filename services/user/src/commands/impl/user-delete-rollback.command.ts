import { Command } from 'core';

export class UserDeleteRollbackCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
