import { Observable } from 'rxjs';
import { IEventSubscriber } from './event.interface';
import { ICommand } from './command.interface';

export type ISaga<
  EventBase extends IEventSubscriber<unknown> = IEventSubscriber<unknown>,
  CommandBase extends ICommand = ICommand
  > = (events$: Observable<EventBase>) => Observable<CommandBase>;
