import { IQueryHandler } from 'core';
import { RetrieveBalanceQuery } from '../impl';
import { BalanceRepository } from '../../repositories';
import { BalanceModel as IBalance } from '../../interfaces';

export class RetrieveBalanceQueryHandler implements IQueryHandler {
  query = RetrieveBalanceQuery;
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async execute(query: RetrieveBalanceQuery): Promise<IBalance> {
    return this._balanceRepository.retrieve(query.idUser);
  }
}
