import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IEventSubscriber } from '../interfaces';
import { Type } from '../interfaces';

export function ofType<TInput extends IEventSubscriber<unknown>, TOutput extends IEventSubscriber<unknown>>(
  ...types: Type<TOutput>[]
) {
  const isInstanceOf = (event: IEventSubscriber<unknown>): event is TOutput =>
    !!types.find((classType) => event instanceof classType);
  return (source: Observable<TInput>): Observable<TOutput> =>
    source.pipe(filter(isInstanceOf));
}
