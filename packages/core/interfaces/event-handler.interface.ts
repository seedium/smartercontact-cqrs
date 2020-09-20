import { IEventSubscriber, IEventSubscriberStatic } from './event.interface';

export interface IEventHandler<T = unknown> {
  event: IEventSubscriberStatic<T>;
  handle(event: IEventSubscriber<T>): Promise<unknown> | unknown;
}
