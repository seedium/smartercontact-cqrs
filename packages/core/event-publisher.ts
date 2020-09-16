export class EventPublisher {
  constructor(private readonly _eventBus: any) {}
  public mergeObjectContext(object: any) {
    const eventBus = this._eventBus;
    object.publish = (event: any) => {
      eventBus.publish(event);
    }
    return object;
  }
}
