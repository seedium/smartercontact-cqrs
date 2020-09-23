import { IQueryHandler } from 'core';
import { Balance } from 'protos';
import { RetrieveBalanceQuery } from '../impl';
import { BalanceRepository } from '../../repositories';

export class RetrieveBalanceQueryHandler implements IQueryHandler {
  query = RetrieveBalanceQuery;
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async execute(query: RetrieveBalanceQuery): Promise<Balance> {
    return this._balanceRepository.retrieveByUser(query.idUser);
  }
}
