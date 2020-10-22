import { IEventPublisher, IEventSubscriber } from 'core';
import { Campaign, CampaignCreatedFailEvent as CampaignCreatedFailEventProto } from 'protos';

export class CampaignCreatedFailEvent implements IEventPublisher, IEventSubscriber<CampaignCreatedFailEvent> {
  public static event = 'campaign.campaign-created-fail';
  public event: string;
  constructor(public readonly campaign: Campaign) {
    this.event = CampaignCreatedFailEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.campaign.toObject());
  }
  toProto(): Uint8Array {
    const campaignCreatedEvent = new CampaignCreatedFailEventProto();
    campaignCreatedEvent.setCampaign(this.campaign);
    return campaignCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CampaignCreatedFailEvent {
    const balanceCreatedEvent = CampaignCreatedFailEventProto.deserializeBinary(message);
    return new CampaignCreatedFailEvent(balanceCreatedEvent.getCampaign());
  }
}
