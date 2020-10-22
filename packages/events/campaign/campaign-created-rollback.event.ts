import { IEventPublisher, IEventSubscriber } from 'core';
import { Campaign, CampaignCreatedRollbackEvent as CampaignCreatedRollbackEventProto } from 'protos';

export class CampaignCreatedRollbackEvent implements IEventPublisher, IEventSubscriber<CampaignCreatedRollbackEvent> {
  public static event = 'campaign.campaign-created-rollback';
  public event: string;
  constructor(public readonly campaign: Campaign) {
    this.event = CampaignCreatedRollbackEvent.event;
  }
  toJson(): string {
    return JSON.stringify(this.campaign.toObject());
  }
  toProto(): Uint8Array {
    const campaignCreatedEvent = new CampaignCreatedRollbackEventProto();
    campaignCreatedEvent.setCampaign(this.campaign);
    return campaignCreatedEvent.serializeBinary();
  }
  fromProto(message: Uint8Array): CampaignCreatedRollbackEvent {
    const balanceCreatedEvent = CampaignCreatedRollbackEventProto.deserializeBinary(message);
    return new CampaignCreatedRollbackEvent(balanceCreatedEvent.getCampaign());
  }
}
