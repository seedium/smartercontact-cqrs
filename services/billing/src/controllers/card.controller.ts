import { QueryBus } from 'core';
import { ListCardsQuery } from '../queries/impl';

export class CardController {
  constructor(
    private readonly _queryBus: QueryBus
  ) {}
  public async list(req) {
    return this._queryBus.execute(new ListCardsQuery(req.params.idUser));
  }
}
