import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, IEventSubscriber, ofType } from 'core';
import { UserCreatedEvent, UserCreatedRollbackEvent, UserDeletedEvent } from '@sc/events';
import { CreateBalanceCommand, DeleteBalanceCommand, CreateBalanceRollbackCommand } from '../commands/impl';

export class UserSaga {
  public userCreated(events$: Observable<IEventSubscriber<any>>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedEvent),
        map((event) => {
          return new CreateBalanceCommand(event.user.getId());
        }),
      );
  }
  public userCreatedRollback(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedRollbackEvent),
        map((event) => {
          return new CreateBalanceRollbackCommand(event.user.getId());
        }),
      );
  }
  public userDeleted(events$: Observable<IEventSubscriber<any>>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserDeletedEvent),
        map((event) => {
          return new DeleteBalanceCommand(event.user.getId());
        }),
      );
  }
}
