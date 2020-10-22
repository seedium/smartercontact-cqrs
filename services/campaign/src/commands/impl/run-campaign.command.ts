import { Command } from 'core';
import { Campaign } from 'protos';

export class RunCampaignCommand extends Command {
  constructor(public readonly campaign: Campaign) {
    super();
  }
}
