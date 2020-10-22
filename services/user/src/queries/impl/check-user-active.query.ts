import { IQuery } from 'core';

export class CheckUserActiveQuery implements IQuery {
  constructor(public readonly idUser: string) {}
}
