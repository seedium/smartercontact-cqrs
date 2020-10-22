import { IEventHandler } from 'core';
import { CampaignCreatedFailEvent, CampaignCreatedRollbackEvent } from '@sc/events';
import { CampaignRepository } from '../../repositories';

export class CampaignCreatedFailEventHandler implements IEventHandler {
  public event = [CampaignCreatedFailEvent, CampaignCreatedRollbackEvent];
  constructor(
    private readonly _campaignRepository: CampaignRepository,
  ) {}
  public async handle(event: CampaignCreatedFailEvent | CampaignCreatedRollbackEvent) {
    await this._campaignRepository.delete(event.campaign.getId());
  }
}
