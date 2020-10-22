import { CommandBus, QueryBus } from 'core';
import {
  RetrieveBalanceOptions,
  RetrieveBalanceResponse,
  Balance,
  ReserveFundsOptions,
  ReserveFundsResponse,
} from 'protos';
import { RetrieveBalanceQuery } from '../queries/impl';
import { ReserveFundsCommand, ReserveFundsRollbackCommand } from '../commands/impl';

export class BalanceController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}
  public async retrieveBalance(req: RetrieveBalanceOptions): Promise<RetrieveBalanceResponse> {
    const balance = await this._queryBus.execute<Balance>(new RetrieveBalanceQuery(req.getIdUser()));
    const retrieveBalanceResponse = new RetrieveBalanceResponse();
    retrieveBalanceResponse.setBalance(balance);
    return retrieveBalanceResponse;
  }
  public async reserveFunds(req: ReserveFundsOptions): Promise<ReserveFundsResponse> {
    const response = new ReserveFundsResponse();
    const isReserved = await this._commandBus.execute<boolean>(new ReserveFundsCommand(req.getUser(), req.getAmount()));
    response.setResult(isReserved);
    return response;
  }
  public async reserveFundsRollback(req: ReserveFundsOptions): Promise<ReserveFundsResponse> {
    const response = new ReserveFundsResponse();
    const isCompensated = await this._commandBus.execute<boolean>(
      new ReserveFundsRollbackCommand(null, req.getUser(), req.getAmount()),
    );
    response.setResult(isCompensated);
    return response;
  }
}
