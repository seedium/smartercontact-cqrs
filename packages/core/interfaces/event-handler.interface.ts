import { IEvent, IEventStatic } from './event.interface';

export interface IEventHandler<T = unknown> {
  event: IEventStatic<IEvent>;
  handle(event: IEvent): Promise<unknown> | unknown;
}
