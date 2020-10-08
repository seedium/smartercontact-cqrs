import { Observable } from 'rxjs';
import { ICommand, ofType } from 'core';
import { BalanceCreatedEvent } from '@sc/events';
import { map } from 'rxjs/operators';
import { SendEmailCommand } from '../commands/impl';

export class BalanceSaga {
  public balanceCreated(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(BalanceCreatedEvent),
        map(() => {
          return new SendEmailCommand({
            to: 'k.zgara@seedium.io',
            subject: 'Balance created',
            template: 'user_balance_created',
          });
        }),
      );
  }
}
