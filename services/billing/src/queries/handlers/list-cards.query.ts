import { IQueryHandler } from 'core';
import { ListCardsQuery } from '../impl';
import { CardRepository } from '../../repositories';
import { Card } from 'protos/billing/entities/card.entity_pb';

export class ListCardsQueryHandler implements IQueryHandler {
  query = ListCardsQuery;
  constructor(private readonly _cardRepository: CardRepository) {}
  public async execute(query: ListCardsQuery): Promise<Card[]> {
    return this._cardRepository.listByUser(query.idUser);
  }
}
