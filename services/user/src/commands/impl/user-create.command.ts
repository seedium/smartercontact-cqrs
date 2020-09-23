import { Command } from 'core';
import { User } from 'protos';

export class UserCreateCommand extends Command {
  constructor(public readonly user: User) {
    super();
  }
  public toJson(): string {
    return JSON.stringify(this.user);
  }
  public toProto(): Uint8Array {
    return this.user.serializeBinary();
  }
}
