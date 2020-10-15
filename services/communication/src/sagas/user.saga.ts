import { Observable } from 'rxjs';
import { ICommand, ofType } from 'core';
import { UserCreatedEvent, UserCreatedFailEvent, UserCreatedRollbackEvent } from '@sc/events';
import { map } from 'rxjs/operators';
import { CreateContactCommand, CreateContactRollbackCommand, SendEmailCommand } from '../commands/impl';

export class UserSaga {
  public userCreatedSendEmail(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedEvent),
        map((event) => {
          return new SendEmailCommand({
            to: event.user.getEmail(),
            subject: 'Welcome to CQRS microservices',
            template: 'welcome_user',
          });
        }),
      );
  }
  public userCreatedCreateContact(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedEvent),
        map((event) => {
          return new CreateContactCommand(event.user.getId());
        }),
      );
  }
  public userCreatedRollback(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedRollbackEvent),
        map((event) => {
          return new CreateContactRollbackCommand(event.user.getId());
        }),
      );
  }
  public userCreatedFail(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedRollbackEvent),
        map(() => {
          return new SendEmailCommand({
            to: 'k.zgara@seedium.io',
            subject: 'Fail register',
            template: 'user_fail_register',
          });
        }),
      );
  }
}
