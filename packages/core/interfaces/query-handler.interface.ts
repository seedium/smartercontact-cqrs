import { IQuery } from './query.interface';
import { Type } from './type';

export interface IQueryHandler<T = unknown> {
  query: Type<IQuery>;
  execute(query: IQuery): Promise<T>;
}
