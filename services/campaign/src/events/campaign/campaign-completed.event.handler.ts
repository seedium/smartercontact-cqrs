import { IEventHandler } from 'core';
import { CampaignCompletedEvent } from '@sc/events';
import { CampaignRepository } from '../../repositories';

export class CampaignCompletedEventHandler implements IEventHandler {
  public event = CampaignCompletedEvent;
  constructor(
    private readonly _campaignRepository: CampaignRepository,
  ) {}
  public async handle({ campaign }: CampaignCompletedEvent): Promise<void> {
    await this._campaignRepository.update(campaign.getId(), campaign);
  }
}
