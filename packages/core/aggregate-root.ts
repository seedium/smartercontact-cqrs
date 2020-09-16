export abstract class AggregateRoot {
  public async publish(event: any) {}
  protected async apply(event: any) {
    await this.publish(event);
  }
}
