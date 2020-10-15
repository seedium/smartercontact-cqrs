import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BalanceCreatedFailEvent, ContactCreatedFailEvent } from '@sc/events';
import { ICommand, ofType } from 'core';
import { UserCreateRollbackCommand } from '../commands/impl';

export class UserSaga {
  public contactCreatedFail(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(ContactCreatedFailEvent),
        map((event) => new UserCreateRollbackCommand(event.contact.getUser())),
      );
  }
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
