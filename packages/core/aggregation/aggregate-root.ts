import { IEventPublisher } from '../interfaces';

export abstract class AggregateRoot {
  protected _aggregateId: string;
  protected _aggregateVersion: number | string;

  public async publish(event: IEventPublisher, aggregateId: string, aggregateVersion: string | number) {}
  protected async apply(event: IEventPublisher): Promise<IEventPublisher> {
    await this.publish(event, this._aggregateId, this._aggregateVersion);
    return event;
  }
}
