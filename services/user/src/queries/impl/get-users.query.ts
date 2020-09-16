export class GetUsersQuery {
  constructor(
    public readonly limit: number,
    public readonly startingAfter: string,
    public readonly endingBefore: string,
  ) {}
}
