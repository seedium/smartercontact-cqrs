import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, IEventSubscriber, ofType } from 'core';
import { UserCreatedEvent, UserDeletedEvent } from '@sc/events';
import { CreateBalanceCommand, DeleteBalanceCommand } from '../commands/impl';

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
