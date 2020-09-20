import { Command } from 'core';

export class UserDeleteCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
