import { IQueryHandler } from 'core';
import { UserRepository } from '../../repositories';
import { CheckUserActiveQuery } from '../impl';

export class CheckUserActiveQueryHandler implements IQueryHandler {
  public query = CheckUserActiveQuery;
  constructor(
    private readonly _userRepository: UserRepository,
  ) {}
  public async execute(query: CheckUserActiveQuery) {
    return await this._userRepository.isUserActive(query.idUser);
  }
}
