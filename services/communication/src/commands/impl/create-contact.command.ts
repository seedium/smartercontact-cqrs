import { Command } from 'core';

export class CreateContactCommand extends Command {
  constructor(public readonly idUser: string) {
    super();
  }
}
