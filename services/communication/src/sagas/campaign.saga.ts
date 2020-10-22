import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, ofType } from 'core';
import { CampaignCompletedEvent } from '@sc/events';
import { SendEmailCommand } from '../commands/impl';

export class CampaignSaga {
  public campaignCompleted(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(CampaignCompletedEvent),
        map(() => {
          return new SendEmailCommand({
            to: 'k.zgara@seedium.io',
            subject: 'Campaign Completed',
            template: 'admin_campaign_completed',
          });
        }),
      );
  }
}
