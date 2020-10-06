import { IEventPublisher, IEventStore } from '../interfaces';

export abstract class AggregateRoot {
  protected _eventStore: IEventStore;
  protected _aggregateId: string;
  protected _aggregateVersion: number | string;

  public async publish(event: IEventPublisher) {}
  protected async apply(event: IEventPublisher): Promise<IEventPublisher> {
    await this._eventStore.commit(
      this._aggregateId,
      this._aggregateVersion,
      event,
      event.constructor.name,
    );
    await this.publish(event);
    return event;
  }
}
