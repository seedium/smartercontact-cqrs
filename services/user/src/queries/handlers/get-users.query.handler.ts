import { GetUsersQuery } from '../impl';
import { UserRepository } from '../../repositories';
import { IQueryHandler } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';

export class GetUsersQueryHandler implements IQueryHandler<User[]> {
  public query = GetUsersQuery;
  constructor(private readonly _repository: UserRepository) {}
  public async execute(query: GetUsersQuery) {
    return this._repository.list({
      ...query,
    });
  }
}
