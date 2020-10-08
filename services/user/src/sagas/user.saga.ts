import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BalanceCreatedFailEvent } from '@sc/events';
import { UserCreateRollbackCommand } from '../commands/impl';
import { ICommand, ofType } from 'core';

export class UserSaga {
  public balanceCreatedFail(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(BalanceCreatedFailEvent),
        map((event) => {
          return new UserCreateRollbackCommand(event.balance.getUser());
        }),
      );
  }
}
