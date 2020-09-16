import { Command } from 'core';

export class UserCreateCommand extends Command {
  public command = 'user.created';
  constructor(public readonly user: any) {
    super();
  }
  public toJson(): string {
    return JSON.stringify(this.user);
  }
}
