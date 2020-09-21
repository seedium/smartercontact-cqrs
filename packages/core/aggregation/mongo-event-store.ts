import { Collection } from 'mongodb';
import { IEventPublisher, IEventStore } from '../interfaces';

export class MongoEventStore implements IEventStore {
  constructor(private readonly _collection: Collection) {}
  public commit(
    aggregateId: string,
    aggregateVersion: unknown,
    event: IEventPublisher,
    eventName: string,
  ): Promise<unknown> | unknown {
    return this._collection.insertOne({
      aggregateId,
      aggregateVersion,
      event: eventName,
      topic: event.event,
      created: Date.now(),
      payload: JSON.parse(event.toJson()),
    });
  }
}
