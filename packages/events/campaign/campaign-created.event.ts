import { IEventPublisher, IEventSubscriber } from 'core';
import { Campaign, CampaignCreatedEvent as CampaignCreatedEventProto } from 'protos';

export class CampaignCreatedEvent implements IEventPublisher, IEventSubscriber<CampaignCreatedEvent> {
  public transactionId: string;
  public static event = 'campaign.campaign-created';
  public event: string;
  constructor(public readonly campaign: Campaign) {
    this.event = CampaignCreatedEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.campaign.toObject());
  }
  toProto(): Uint8Array {
    const campaignCreatedEvent = new CampaignCreatedEventProto();
    campaignCreatedEvent.setCampaign(this.campaign);
    return campaignCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CampaignCreatedEvent {
    const balanceCreatedEvent = CampaignCreatedEventProto.deserializeBinary(message);
    return new CampaignCreatedEvent(balanceCreatedEvent.getCampaign());
  }
}
