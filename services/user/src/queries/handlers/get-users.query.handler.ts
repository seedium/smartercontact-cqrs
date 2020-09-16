import { GetUsersQuery } from '../impl';
import { UserRepository } from '../../repositories';

class GetUsersQueryHandler {
  public query = GetUsersQuery;
  constructor(private readonly _repository: UserRepository) {}
  public async execute(query: GetUsersQuery) {
    return this._repository.list({
      ...query,
    });
  }
}
