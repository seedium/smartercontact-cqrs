import { IEventPublisher, IEventSubscriber } from 'core';
import { Campaign, CampaignCompletedEvent as CampaignCompletedEventProto } from 'protos';

export class CampaignCompletedEvent implements IEventPublisher, IEventSubscriber<CampaignCompletedEvent> {
  public static event = 'campaign.campaign-completed';
  public event: string;
  constructor(public readonly campaign: Campaign) {
    this.event = CampaignCompletedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.campaign.toObject());
  }
  toProto(): Uint8Array {
    const campaignCreatedEvent = new CampaignCompletedEventProto();
    campaignCreatedEvent.setCampaign(this.campaign);
    return campaignCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CampaignCompletedEvent {
    const balanceCreatedEvent = CampaignCompletedEventProto.deserializeBinary(message);
    return new CampaignCompletedEvent(balanceCreatedEvent.getCampaign());
  }
}
