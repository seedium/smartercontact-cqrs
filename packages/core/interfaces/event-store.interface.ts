import { IEvent } from './event.interface';

export interface IEventStore {
  commit(aggregateId: string, aggregateVersion: unknown, event: IEvent): Promise<unknown> | unknown;
}
