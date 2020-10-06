import { Command } from 'core';
import { User } from 'protos';

export class UserCreateCommand extends Command {
  constructor(public readonly user: User) {
    super();
  }
}
