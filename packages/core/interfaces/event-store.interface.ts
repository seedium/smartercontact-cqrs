import { IEventPublisher } from './event.interface';

export interface IEventStore {
  commit(aggregateId: string, aggregateVersion: unknown, event: IEventPublisher, eventName: string): Promise<unknown> | unknown;
}
