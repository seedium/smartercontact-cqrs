import { Campaign } from 'protos';

export class CreateCampaignOrchestrator {
  constructor(
    public readonly idUser: string,
    public readonly contacts: string[],
  ) {}
}
