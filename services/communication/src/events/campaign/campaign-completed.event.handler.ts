import { CampaignCompletedEvent } from '@sc/events';
import { IEventHandler } from 'core';

export class CampaignCompletedEventHandler implements IEventHandler<CampaignCompletedEvent> {
  public event = CampaignCompletedEvent;
  public async handle() {}
}
