import { Command } from 'core';

export class DeleteBalanceCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
