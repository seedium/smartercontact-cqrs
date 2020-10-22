import { IEventPublisher } from '../interfaces';

export abstract class AggregateRoot {
  protected _aggregateId: string;
  protected _aggregateVersion: number | string;

  constructor(protected _transactionId: string) {}
  public async publish(
    event: IEventPublisher,
    aggregateId: string,
    aggregateVersion: string | number,
    transactionId: string,
  ) {}
  protected async apply(event: IEventPublisher): Promise<IEventPublisher> {
    await this.publish(event, this._aggregateId, this._aggregateVersion, this._transactionId);
    return event;
  }
}
