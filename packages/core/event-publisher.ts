import { EventBus } from './lib';
import { IEventPublisher, IEventStore } from './interfaces';
import { AggregateRoot } from './aggregation';

export class EventPublisher {
  constructor(
    private readonly _eventBus: EventBus,
    private readonly _eventStore: IEventStore,
  ) {}
  public mergeObjectContext<T extends AggregateRoot>(object: T): T {
    const eventBus = this._eventBus;
    object.publish = async (event: IEventPublisher, aggregateId: string, aggregateVersion: number | string) => {
      await Promise.all([
        this._eventStore.commit(
          aggregateId,
          aggregateVersion,
          event,
          event.constructor.name,
        ),
        eventBus.publish(event),
      ]);
    }
    return object;
  }
}
