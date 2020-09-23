import { CommandBus, QueryBus } from 'core';
import {
  User,
  ListResponse,
  Void,
  RetrieveUserOptions,
  RetrieveUserResponse,
  UserListOptions,
  UserListResponse,
  DeleteUserOptions,
} from 'protos';
import { UserCreateCommand, UserDeleteCommand } from '../commands/impl';
import { GetUsersQuery, RetrieveUserQuery } from '../queries/impl';

export class UserController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}
  public async list(req: UserListOptions): Promise<UserListResponse> {
    const users = await this._queryBus.execute<User[]>(
      new GetUsersQuery(
        req.getOptions().getLimit(),
        req.getOptions().getStartingAfter(),
        req.getOptions().getEndingBefore(),
      ),
    );
    const listOptionsResponse = new ListResponse();
    const userListResponse = new UserListResponse();

    listOptionsResponse.setHasMore(false);
    userListResponse.setOptions(listOptionsResponse);
    userListResponse.setDataList(users);

    return userListResponse;
  }
  public async retrieve(req: RetrieveUserOptions): Promise<RetrieveUserResponse> {
    const user = await this._queryBus.execute<User>(
      new RetrieveUserQuery(req.getIdUser()),
    );
    const retrieveUserResponse = new RetrieveUserResponse();
    retrieveUserResponse.setUser(user);
    return retrieveUserResponse;
  }
  public async create(userDto: User): Promise<User> {
    return await this._commandBus.execute<User>(new UserCreateCommand(userDto));
  }
  public async delete(req: DeleteUserOptions): Promise<Void> {
    await this._commandBus.execute(new UserDeleteCommand(req.getId()));
    return new Void();
  }
}
