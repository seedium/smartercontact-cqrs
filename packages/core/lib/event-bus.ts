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
      topic: eventHandler.event.event,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        await eventHandler.handle(
          eventHandler.event.fromProto(message.value),
        );
      },
    });
  }
  public async publish(event: IEvent) {
    await this._producer.send({
      topic: event.event,
      messages: [{
        value: Buffer.from(event.toProto()),
      }],
    });
  }
}
