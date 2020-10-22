import { Command } from 'core';

export class CheckUserActiveCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
