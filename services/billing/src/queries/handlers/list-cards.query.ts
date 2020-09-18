import { IQueryHandler } from 'core';
import { ListCardsQuery } from '../impl';
import { CardRepository } from '../../repositories';
import { ICardModel } from '../../interfaces';

export class ListCardsQueryHandler implements IQueryHandler {
  query = ListCardsQuery;
  constructor(private readonly _cardRepository: CardRepository) {}
  public async execute(query: ListCardsQuery): Promise<ICardModel[]> {
    return this._cardRepository.list(query.idUser);
  }
}
