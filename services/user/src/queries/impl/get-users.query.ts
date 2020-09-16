import { IQuery } from 'core';

export class GetUsersQuery implements IQuery {
  constructor(
    public readonly limit: number = 20,
    public readonly startingAfter: string = null,
    public readonly endingBefore: string = null,
  ) {}
}
