import { Observable } from 'rxjs';
import { ICommand, ofType } from 'core';
import { CampaignCreatedFailEvent } from '@sc/events';
import { map } from 'rxjs/operators';
import { CreateCampaignRollbackCommand } from '../commands/impl';

export class CampaignSaga {
  public createFail(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(CampaignCreatedFailEvent),
        map((event) => {
          return new CreateCampaignRollbackCommand(event.campaign);
        }),
      );
  }
}
