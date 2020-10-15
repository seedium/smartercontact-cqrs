import { Command } from 'core';

export class CreateContactRollbackCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
