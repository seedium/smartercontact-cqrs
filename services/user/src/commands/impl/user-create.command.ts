import { Command } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';

export class UserCreateCommand extends Command {
  public command = 'user.created';
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
