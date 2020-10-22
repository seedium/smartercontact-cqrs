import { EventPublisher, ICommandHandler } from 'core';
import { Campaign as CampaignProto } from 'protos';
import { CreateCampaignCommand } from '../impl';
import { Campaign } from '../../models';
import { CampaignRepository } from '../../repositories';

export class CreateCampaignCommandHandler implements ICommandHandler {
  public command = CreateCampaignCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _campaignRepository: CampaignRepository,
  ) {
  }
  public async execute(command: CreateCampaignCommand) {
    const campaign = new CampaignProto();
    campaign.setContactsList(command.contacts);
    campaign.setUser(command.idUser);
    campaign.setCreated(Date.now());
    campaign.setName('test');
    const campaignAggregate = this._eventPublisher.mergeObjectContext(
      new Campaign(campaign, command.id)
    );
    command.aggregation = campaignAggregate;
    await campaignAggregate.create();
    return campaignAggregate.campaign;
  }
  public async onFail(command: CreateCampaignCommand) {
    let campaignAggregate = command.aggregation;
    if (!campaignAggregate) {
      campaignAggregate = this._eventPublisher.mergeObjectContext(
        new Campaign(new CampaignProto(), command.id),
      );
    }
    await campaignAggregate.createFail();
  }
}
