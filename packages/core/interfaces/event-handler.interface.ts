import { IEvent } from './event.interface';
import { Type } from './type';

export interface IEventHandler<T = unknown> {
  event: Type<IEvent>;
  handle(event: IEvent): Promise<unknown> | unknown;
}
