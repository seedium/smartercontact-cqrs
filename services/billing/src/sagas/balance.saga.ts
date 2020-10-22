import { Observable } from 'rxjs';
import { ICommand, ofType } from 'core';
import { ReserveFundsFailEvent } from '@sc/events';
import { map } from 'rxjs/operators';
import { ReserveFundsRollbackCommand } from '../commands/impl';

export class BalanceSaga {
  public reserveFundsFailed(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(ReserveFundsFailEvent),
        map((event) => {
          return new ReserveFundsRollbackCommand(event.balance);
        }),
      );
  }
}
