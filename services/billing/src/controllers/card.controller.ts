import { CommandBus, QueryBus } from 'core';
import { ListCardsQuery } from '../queries/impl';
import { CardMapper } from '../mappers';
import { Card } from 'protos/billing/entities/card.entity_pb';
import { CreateUserCardCommand } from '../commands/impl';

export class CardController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
    private readonly _cardMapper: CardMapper,
  ) {}
  public async create(req) {
    const cardDto = this._cardMapper.fromObject(req.body);
    const card = await this._commandBus.execute<Card>(new CreateUserCardCommand(req.params.idUser, cardDto));
    return this._cardMapper.toObject(card);
  }
  public async list(req) {
    const cards = await this._queryBus.execute<Card[]>(new ListCardsQuery(req.params.idUser));
    return {
      has_more: false,
      data: this._cardMapper.toArray(cards),
    };
  }
}
