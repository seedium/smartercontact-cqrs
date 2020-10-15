import { IEventPublisher, IEventSubscriber, IEventSubscriberStatic } from './event.interface';

export interface IEventHandler<T = unknown> {
  event: IEventSubscriberStatic<T> | IEventSubscriberStatic<T>[];
  handle(event: IEventSubscriber<T>): Promise<unknown> | unknown;
  onFail?(event: IEventSubscriber<T>): Promise<IEventPublisher> | Promise<void>;
}
