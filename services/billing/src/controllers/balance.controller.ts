import { QueryBus } from 'core';
import { RetrieveBalanceOptions, RetrieveBalanceResponse, Balance } from 'protos';
import { RetrieveBalanceQuery } from '../queries/impl';

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
