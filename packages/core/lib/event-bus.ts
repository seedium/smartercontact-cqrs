import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Consumer } from 'kafkajs';
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
  public async registerEventHandler(group: string, eventHandler: IEventHandler) {
    await this.initConsumer(group, eventHandler);
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
      .subscribe(async (command) => {
        try {
          await this._commandBus.execute(command)
        } catch (err) {
          console.error(err);
        }
      });

    this.subscriptions.push(subscription);
  }
  private async initConsumer(groupPrefix: string, eventHandler: IEventHandler): Promise<void> {
    const events = this.getEvents(eventHandler);
    const groupId = this.getGroupId(groupPrefix, events);
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await this.subscribeOnTopics(consumer, events);
    await consumer.run({
      eachMessage: async ({ message, topic }) => {
        const event = this.parseMessageFromProto(eventHandler, topic, message.value);
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
  private getGroupId(groupPrefix: string, events: IEventSubscriber<unknown>[]): string {
    let groupId = `${groupPrefix}`;
    events.forEach((event) => {
      groupId += `.${event.event}`;
    });
    return groupId;
  }
  private getEvents(eventHandler: IEventHandler): IEventSubscriber<unknown>[] {
    const events = [];
    if (!Array.isArray(eventHandler.event)) {
      events.push(eventHandler.event);
    } else {
      events.push(...eventHandler.event);
    }
    return events;
  }
  private async subscribeOnTopics(consumer: Consumer, events: IEventSubscriber<unknown>[]): Promise<void> {
    await Promise.all(
      events.map(
        (event) => consumer.subscribe({
          topic: event.event,
        }),
      ),
    );
  }
  private parseMessageFromProto(eventHandler: IEventHandler, topic: string, message: Buffer): IEventSubscriber<unknown> {
    const events = [];
    if (!Array.isArray(eventHandler.event)) {
      events.push(eventHandler.event);
    } else {
      events.push(...eventHandler.event);
    }

    for (const event of events) {
      if (event.event === topic) {
        const eventInstance = new event() as IEventSubscriber<IEventSubscriber<unknown>>;
        return eventInstance.fromProto(message);
      }
    }
  }
}
