import { Collection } from 'mongodb';
import { CampaignMapper } from 'mappers';
import { Campaign } from 'protos';
import { viewDb } from '../lib';

export class CampaignRepository {
  private _collection: Collection;

  constructor(
    private readonly _campaignMapper: CampaignMapper,
  ) {
    this._collection = viewDb.db('cqrs_view_campaign').collection('campaigns');
  }
  public async create(campaign: Campaign) {
    const campaignDto = this._campaignMapper.toObject(campaign);
    const result = await this._collection.insertOne(campaignDto);
    return this._campaignMapper.fromObject(result.ops[0]);
  }
  public async update(idCampaign: string, campaign: Campaign) {
    const campaignDto = this._campaignMapper.toObject(campaign);
    await this._collection.updateOne({ id: idCampaign }, {
      $set: campaignDto,
    });
  }
  public async delete(idCampaign: string) {
    await this._collection.deleteOne({ id: idCampaign });
  }
  public async retrieve(idCampaign: string): Promise<Campaign | null> {
    const campaign = await this._collection.findOne({ id: idCampaign });
    if (!campaign) {
      return null;
    }
    return this._campaignMapper.fromObject(campaign);
  }
}
