import { RetrieveUserQuery } from '../impl';
import { UserRepository } from '../../repositories';
import { IQueryHandler } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';

export class RetrieveUserQueryHandler implements IQueryHandler<User> {
  public query = RetrieveUserQuery;
  constructor(private readonly _repository: UserRepository) {}
  public async execute(query: RetrieveUserQuery) {
    return this._repository.retrieve(query.idUser);
  }
}
