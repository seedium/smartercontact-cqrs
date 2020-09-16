import { CommandBus, QueryBus } from 'core';
import { UserCreateCommand } from '../commands/impl';
import { GetUsersQuery } from '../queries/impl';

export class UserController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}
  public async getAll(req) {
    const users = await this._queryBus.execute(
      new GetUsersQuery(req.query.limit, req.query.startingAfter, req.query.endingBefore),
    );
    return {
      data: users,
    };
  }
  public async create(req) {
    await this._commandBus.execute(new UserCreateCommand(req.body));
    return { success: true };
  }
}
