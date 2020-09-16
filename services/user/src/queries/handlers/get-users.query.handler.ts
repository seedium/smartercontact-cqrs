import { GetUsersQuery } from '../impl';
import { UserRepository } from '../../repositories';
import { IQueryHandler } from 'core';
import { UserDto } from '../../interfaces/dto';

export class GetUsersQueryHandler implements IQueryHandler<UserDto[]> {
  public query = GetUsersQuery;
  constructor(private readonly _repository: UserRepository) {}
  public async execute(query: GetUsersQuery) {
    return this._repository.list({
      ...query,
    });
  }
}
