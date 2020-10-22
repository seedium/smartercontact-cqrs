import { EventPublisher, ICommandHandler } from 'core';
import { RunCampaignCommand } from '../impl';
import { CommunicationService } from '../../services';
import { Campaign } from '../../models';

export class RunCampaignCommandHandler implements ICommandHandler {
  public command = RunCampaignCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _communicationService: CommunicationService,
  ) {
  }
  public async execute({ campaign, id }: RunCampaignCommand) {
    const acceptedList: string[] = [];
    for (const email of campaign.getContactsList()) {
      if (!this.validateEmail(email)) {
        continue;
      }
      const acceptedEmails = await this._communicationService.sendEmailToContact(email);
      acceptedList.push(...acceptedEmails);
    }
    campaign.setAcceptedList(acceptedList);
    const campaignAggregate = this._eventPublisher.mergeObjectContext(
      new Campaign(campaign, id),
    );
    await campaignAggregate.complete();
    return campaign;
  }
  public onFail(command: RunCampaignCommand) {
    console.log(`rollback ${this.constructor.name}`);
  }
  protected validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
