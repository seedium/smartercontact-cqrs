import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { kafka } from './kafka';
import { IEventPublisher, IEventSubscriber, IEventHandler, ISaga } from '../interfaces';
import { ObservableBus } from './observable-bus';
import { CommandBus } from './command-bus';

export class EventBus<EventBase extends IEventSubscriber<unknown> = IEventSubscriber<unknown>> extends ObservableBus<EventBase> {
  private readonly _producer = kafka.producer();
  protected readonly subscriptions: Subscription[] = [];

  constructor(private readonly _commandBus: CommandBus) {
    super();
  }
  public async init() {
    await this._producer.connect();
  }
  public async registerEventHandler(groupId: string, eventHandler: IEventHandler) {
    await this.initConsumer(groupId, eventHandler);
  }
  public async publish(event: IEventPublisher) {
    await this._producer.send({
      topic: event.event,
      messages: [{
        value: Buffer.from(event.toProto()),
      }],
    });
  }
  public registerSaga(saga: ISaga<EventBase>) {
    const stream$ = saga(this);
    if (!(stream$ instanceof Observable)) {
      throw new Error('Stream is not observable');
    }

    const subscription = stream$
      .pipe(filter((e) => !!e))
      .subscribe((command) => this._commandBus.execute(command));

    this.subscriptions.push(subscription);
  }
  private async initConsumer(groupId: string, eventHandler: IEventHandler): Promise<void> {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({
      topic: eventHandler.event.event,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const tempEventHandler = new eventHandler.event() as IEventSubscriber<unknown>;
        const event = tempEventHandler.fromProto(message.value) as IEventSubscriber<unknown>;
        try {
          await eventHandler.handle(event);
          this.subject$.next(event as any);
        } catch (err) {
          console.error(err);
          if (!eventHandler.onFail) {
            return;
          }
          const failEvent = await eventHandler.onFail(event);
          if (failEvent) {
            this.subject$.next(failEvent as any);
          }
        }
      },
    });
  }
}
