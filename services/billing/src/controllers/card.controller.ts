import { CommandBus, QueryBus } from 'core';
import { ListCardsQuery } from '../queries/impl';
import { Card } from 'protos/billing/entities/card.entity_pb';
import { CreateCardOptions, CreateCardResponse } from 'protos/billing/api/create-card_pb';
import { ListCardOptions, ListCardResponse } from 'protos/billing/api/list-card_pb';
import { CreateUserCardCommand } from '../commands/impl';
import { ListResponse } from 'protos/common/api_pb';

export class CardController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}
  public async create(req: CreateCardOptions): Promise<CreateCardResponse> {
    const card = await this._commandBus.execute<Card>(
      new CreateUserCardCommand(req.getIdUser(), req.getCard()),
    );

    const createCardResponse = new CreateCardResponse();
    createCardResponse.setCard(card);
    return createCardResponse;
  }
  public async list(req: ListCardOptions): Promise<ListCardResponse> {
    const cards = await this._queryBus.execute<Card[]>(new ListCardsQuery(req.getIdUser()));

    const listCardResponse = new ListCardResponse();
    listCardResponse.setDataList(cards);
    listCardResponse.setOptions(new ListResponse().setHasMore(false));
    return listCardResponse;
  }
}
