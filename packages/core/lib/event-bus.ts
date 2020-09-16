import { kafka } from './kafka';
import { IEvent, IEventHandler } from '../interfaces';

export class EventBus {
  private _producer = kafka.producer();
  public async init() {
    await this._producer.connect();
  }
  public async registerEventHandler(groupId: string, eventHandler: IEventHandler) {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({
      /* @ts-ignore */
      topic: eventHandler.event.event,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        await eventHandler.handle(
          new eventHandler.event(JSON.parse(message.value.toString())),
        );
      },
    });
  }
  public async publish(event: IEvent) {
    await this._producer.send({
      topic: event.event,
      messages: [{
        value: event.toJson(),
      }],
    });
  }
}
