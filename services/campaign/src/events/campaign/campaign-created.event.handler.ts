import { EventPublisher, IEventHandler } from 'core';
import { CampaignCreatedEvent } from '@sc/events';
import { CampaignRepository } from '../../repositories';
import { Campaign } from '../../models';

export class CampaignCreatedEventHandler implements IEventHandler {
  public event = CampaignCreatedEvent;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _campaignRepository: CampaignRepository,
  ) {}
  public async handle(event: CampaignCreatedEvent): Promise<void> {
    await this._campaignRepository.create(event.campaign);
  }
  public async onFail(event: CampaignCreatedEvent) {
    const campaign = this._eventPublisher.mergeObjectContext(
      new Campaign(event.campaign),
    );
    await campaign.createFail();
  }
}
