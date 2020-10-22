import { Campaign, CreateCampaignOptions, CreateCampaignResponse } from 'protos';
import { OrchestratorBus } from 'core';
import { CreateCampaignOrchestrator } from '../orchestrators/impl';

export class CampaignController {
  constructor(
    private readonly _orchestratorBus: OrchestratorBus<any>,
  ) {}
  public async create(req: CreateCampaignOptions): Promise<CreateCampaignResponse> {
    const result = await this._orchestratorBus.execute<Campaign>(
      new CreateCampaignOrchestrator(
        req.getUser(),
        req.getContactsList(),
      ),
    );
    const response = new CreateCampaignResponse();
    response.setCampaign(result);
    return response;
  }
}
