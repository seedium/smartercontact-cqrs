import { IEvent, IEventStore } from '../interfaces';

export abstract class AggregateRoot {
  protected _eventStore: IEventStore;
  protected _aggregateId: string;
  protected _aggregateVersion: number | string;

  public async publish(event: IEvent) {}
  protected async apply(event: IEvent) {
    await this._eventStore.commit(this._aggregateId, this._aggregateVersion, event);
    await this.publish(event);
  }
}
