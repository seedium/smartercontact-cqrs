import { IQuery } from 'core';

export class RetrieveBalanceQuery implements IQuery {
  constructor(public readonly idUser: string) {}
}
