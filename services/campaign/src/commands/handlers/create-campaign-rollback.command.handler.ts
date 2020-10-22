import { EventPublisher, ICommandHandler } from 'core';
import { CreateCampaignRollbackCommand } from '../impl';
import { CampaignRepository } from '../../repositories';
import { Campaign } from '../../models';

export class CreateCampaignRollbackCommandHandler implements ICommandHandler {
  public command = CreateCampaignRollbackCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _campaignRepository: CampaignRepository,
  ) {
  }
  public async execute(command: CreateCampaignRollbackCommand) {
    const campaign = await this._campaignRepository.retrieve(command.campaign.getId());
    let campaignAggregate: Campaign;
    if (!campaign) {
      campaignAggregate = this._eventPublisher.mergeObjectContext(
        new Campaign(command.campaign, command.id),
      );
    } else {
      campaignAggregate = this._eventPublisher.mergeObjectContext(
        new Campaign(campaign, command.id),
      );
    }
    await campaignAggregate.createRollback();
  }
}
