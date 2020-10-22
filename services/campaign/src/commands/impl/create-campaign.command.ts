import { Command } from 'core';
import { Campaign } from '../../models';

export class CreateCampaignCommand extends Command {
  private _campaignAggregation: Campaign;
  set aggregation(value: Campaign) {
    this._campaignAggregation = value;
  }
  get aggregation() {
    return this._campaignAggregation;
  }
  constructor(public readonly idUser: string, public readonly contacts: string[]) {
    super();
  }
}
