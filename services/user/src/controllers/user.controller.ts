import { CommandBus } from 'core';
import { UserCreateCommand } from '../commands/impl';

export class UserController {
  constructor(private readonly _commandBus: CommandBus) {}
  public async getAll() {
    return {
      data: [],
    };
  }
  public async create(req) {
    await this._commandBus.execute(new UserCreateCommand(req.body));
    return { success: true };
  }
}
