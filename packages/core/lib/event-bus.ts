import { kafka } from './kafka';
import { IEventPublisher, IEventSubscriber, IEventHandler } from '../interfaces';

export class EventBus {
  private _producer = kafka.producer();
  public async init() {
    await this._producer.connect();
  }
  public async registerEventHandler(groupId: string, eventHandler: IEventHandler) {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({
      topic: eventHandler.event.event,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const tempEventHandler = new eventHandler.event() as IEventSubscriber<unknown>;
        await eventHandler.handle(
          tempEventHandler.fromProto(message.value) as IEventSubscriber<unknown>,
        );
      },
    });
  }
  public async publish(event: IEventPublisher) {
    await this._producer.send({
      topic: event.event,
      messages: [{
        value: Buffer.from(event.toProto()),
      }],
    });
  }
}
