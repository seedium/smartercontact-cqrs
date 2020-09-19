import { CommandBus, QueryBus } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';
import { UserMapper } from '../mappers';
import { UserCreateCommand, UserDeleteCommand } from '../commands/impl';
import { GetUsersQuery } from '../queries/impl';

export class UserController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
    private readonly _userMapper: UserMapper,
  ) {}
  public async getAll(req) {
    const users = await this._queryBus.execute<User[]>(
      new GetUsersQuery(req.query.limit, req.query.startingAfter, req.query.endingBefore),
    );
    return {
      data: this._userMapper.toArray(users),
    };
  }
  public async create(req) {
    const userDto = this._userMapper.fromObject(req.body);

    const user = await this._commandBus.execute<User>(new UserCreateCommand(userDto));
    return this._userMapper.toObject(user);
  }
  public async delete(req) {
    await this._commandBus.execute(new UserDeleteCommand(req.params.idUser));
    return {
      success: true,
    };
  }
}
