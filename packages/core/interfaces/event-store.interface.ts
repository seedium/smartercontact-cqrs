import { IEventPublisher } from './event.interface';

export interface IEventStore {
  commit(aggregateId: string, aggregateVersion: unknown, transactionId: string, event: IEventPublisher, eventName: string): Promise<unknown> | unknown;
}
