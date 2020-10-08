import { Observable } from 'rxjs';
import { ICommand, ofType } from 'core';
import { UserCreatedEvent, UserCreatedFailEvent } from '@sc/events';
import { map } from 'rxjs/operators';
import { SendEmailCommand } from '../commands/impl';

export class UserSaga {
  public userCreated(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedEvent),
        map((event) => {
          return new SendEmailCommand({
            to: event.user.getEmail(),
            subject: 'Welcome to CQRS microservices',
            template: 'welcome_user',
          });
        })
      );
  }
  public userCreatedFail(events$: Observable<any>): Observable<ICommand> {
    return events$
      .pipe(
        ofType(UserCreatedFailEvent),
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
