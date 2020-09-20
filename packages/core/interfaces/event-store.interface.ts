import { IEventPublisher } from './event.interface';

export interface IEventStore {
  commit(aggregateId: string, aggregateVersion: unknown, event: IEventPublisher): Promise<unknown> | unknown;
}
