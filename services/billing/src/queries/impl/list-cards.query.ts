import { IQuery } from 'core';

export class ListCardsQuery implements IQuery {
  constructor(public readonly idUser: string) {}
}
