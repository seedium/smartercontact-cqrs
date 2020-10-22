import { Command } from 'core';
import { Campaign } from 'protos';

export class CreateCampaignRollbackCommand extends Command {
  constructor(public readonly campaign: Campaign) {
    super();
  }
}
