import { QueryBus } from 'core';
import { RetrieveBalanceQuery } from '../queries/impl';
import { BalanceMapper } from '../mappers';
import { Balance } from 'protos/billing/entities/balance.entity_pb';

export class BalanceController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _balanceMapper: BalanceMapper,
  ) {}
  public async getBalance(req) {
    const balance = await this._queryBus.execute<Balance>(new RetrieveBalanceQuery(req.params.idUser));
    return this._balanceMapper.toObject(balance);
  }
}
