import { IQueryHandler } from 'core';
import { Card } from 'protos';
import { ListCardsQuery } from '../impl';
import { CardRepository } from '../../repositories';

export class ListCardsQueryHandler implements IQueryHandler {
  query = ListCardsQuery;
  constructor(private readonly _cardRepository: CardRepository) {}
  public async execute(query: ListCardsQuery): Promise<Card[]> {
    return this._cardRepository.listByUser(query.idUser);
  }
}
