import { IQueryHandler } from 'core';
import { User } from 'protos';
import { RetrieveUserQuery } from '../impl';
import { UserRepository } from '../../repositories';

export class RetrieveUserQueryHandler implements IQueryHandler<User> {
  public query = RetrieveUserQuery;
  constructor(private readonly _repository: UserRepository) {}
  public async execute(query: RetrieveUserQuery) {
    return this._repository.retrieve(query.idUser);
  }
}
