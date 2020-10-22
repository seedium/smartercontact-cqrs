import { v4 } from 'uuid';
import { Campaign as CampaignProto } from 'protos';
import { AggregateRoot } from 'core';
import {
  CampaignCreatedEvent,
  CampaignCreatedFailEvent,
  CampaignCreatedRollbackEvent,
  CampaignCompletedEvent,
} from '@sc/events';
import { createCampaignId } from '../helpers/create-campaign-id.helper';

export class Campaign extends AggregateRoot {
  constructor(
    public readonly campaign: CampaignProto,
    transactionId: string = v4(),
  ) {
    super(transactionId);
    this._aggregateId = this.campaign.getId();
    this._aggregateVersion = 1;
  }
  public async create() {
    this.campaign.setId(createCampaignId());
    this._aggregateId = this.campaign.getId();
    await this.apply(new CampaignCreatedEvent(this.campaign));
    return this;
  }
  public async createFail() {
    await this.apply(new CampaignCreatedFailEvent(this.campaign));
  }
  public async createRollback() {
    await this.apply(new CampaignCreatedRollbackEvent(this.campaign));
  }
  public async complete() {
    await this.apply(new CampaignCompletedEvent(this.campaign));
  }
}
