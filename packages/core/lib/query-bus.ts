import { IQueryHandler, IQuery, Type } from '../interfaces';

export class QueryBus {
  private readonly _map = new Map<string, IQueryHandler>();
  public registerQuery(queryHandler: IQueryHandler) {
    const queryName = this.getQueryName(queryHandler.query);
    const handler = this._map.get(queryName);
    if (handler) {
      console.log(`You will overwrite ${queryName}`);
    }
    this._map.set(queryName, queryHandler);
  }
  public async execute<T>(query: IQuery): Promise<T> {
    const queryName = this.getQueryName(query);
    const handler = this._map.get(queryName);
    if (!handler) {
      throw new Error(`${queryName} doesn't have any handlers`);
    }
    return await handler.execute(query) as T;
  }
  protected getQueryName(query: Type<IQuery> | IQuery): string {
    if (query instanceof Function) {
      return query.name;
    } else {
      return query.constructor.name;
    }
  }
}
