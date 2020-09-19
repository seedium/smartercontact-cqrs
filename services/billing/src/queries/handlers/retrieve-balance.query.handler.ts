import { IQueryHandler } from 'core';
import { RetrieveBalanceQuery } from '../impl';
import { BalanceRepository } from '../../repositories';
import { Balance } from 'protos/billing/entities/balance.entity_pb';

export class RetrieveBalanceQueryHandler implements IQueryHandler {
  query = RetrieveBalanceQuery;
  constructor(private readonly _balanceRepository: BalanceRepository) {}
  public async execute(query: RetrieveBalanceQuery): Promise<Balance> {
    return this._balanceRepository.retrieve(query.idUser);
  }
}
