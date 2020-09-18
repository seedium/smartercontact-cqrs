import { Collection } from 'mongodb';
import { IEvent, IEventStore } from '../interfaces';

export class MongoEventStore implements IEventStore {
  constructor(private readonly _collection: Collection) {}
  public commit(aggregateId: string, aggregateVersion: unknown, event: IEvent): Promise<unknown> | unknown {
    return this._collection.insertOne({
      aggregateId,
      aggregateVersion,
      event: event.constructor.name,
      topic: event.event,
      payload: JSON.parse(event.toJson()),
    });
  }
}
