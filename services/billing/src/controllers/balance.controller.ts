import { QueryBus } from 'core';
import { RetrieveBalanceQuery } from '../queries/impl';
import { RetrieveBalanceOptions, RetrieveBalanceResponse } from 'protos/billing/api/retrieve-balance_pb';
import { Balance } from 'protos/billing/entities/balance.entity_pb';

export class BalanceController {
  constructor(
    private readonly _queryBus: QueryBus,
  ) {}
  public async retrieveBalance(req: RetrieveBalanceOptions): Promise<RetrieveBalanceResponse> {
    const balance = await this._queryBus.execute<Balance>(new RetrieveBalanceQuery(req.getIdUser()));
    const retrieveBalanceResponse = new RetrieveBalanceResponse();
    retrieveBalanceResponse.setBalance(balance);
    return retrieveBalanceResponse;
  }
}
