import { Command } from 'core';

export class CreateBalanceCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
