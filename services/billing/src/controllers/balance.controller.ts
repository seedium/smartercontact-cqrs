import { QueryBus } from 'core';
import { RetrieveBalanceQuery } from '../queries/impl';

export class BalanceController {
  constructor(
    private readonly _queryBus: QueryBus,
  ) {}
  public async getBalance(req) {
    return this._queryBus.execute(new RetrieveBalanceQuery(req.params.idUser));
  }
}
