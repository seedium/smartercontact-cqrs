import { IQuery } from 'core';

export class RetrieveUserQuery implements IQuery {
  constructor(
    public readonly idUser: string,
  ) {}
}
