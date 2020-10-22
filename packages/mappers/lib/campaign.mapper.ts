import { DataMapper } from 'core';
import { Campaign } from 'protos/campaign/entities/campaign.entity_pb';
import type { Campaign as CampaignDto } from 'protos/campaign/entities/campaign.entity_pb';

export class CampaignMapper extends DataMapper<Campaign, CampaignDto.AsObject> {
  public readonly map = {
    Id: 'id',
    User: 'user',
    Name: 'name',
    ContactsList: 'contacts',
    AcceptedList: 'accepted',
    Created: 'created',
  };
  public readonly entity = Campaign;
}
