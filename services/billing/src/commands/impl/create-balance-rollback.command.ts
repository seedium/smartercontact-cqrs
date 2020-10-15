import { Command } from 'core';

export class CreateBalanceRollbackCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
