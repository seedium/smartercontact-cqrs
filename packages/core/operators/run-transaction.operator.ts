import {
  Observable,
  Subscriber,
  Operator,
  TeardownLogic,
} from 'rxjs';
import { ICommand } from '../interfaces';
import { OrchestratorContext, OrchestratorMonoTypeOperatorFunction } from '../lib';
import { CommandBus } from '../lib';

export type Transaction = (value: OrchestratorContext) => ICommand;

export function runTransaction<TInput extends OrchestratorContext, TOutput>(func: Transaction): OrchestratorMonoTypeOperatorFunction<TInput> {
  return function runTransactionOperatorFunction(source: Observable<any>, commandBus: CommandBus) {
    return source.lift(new RunTransactionOperator(func, commandBus));
  }
}

class RunTransactionOperator<T extends OrchestratorContext> implements Operator<T, T>{
  constructor(
    private func: Transaction,
    private _commandBus: CommandBus,
  ) {
  }
  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new RunTransactionSubscriber(subscriber, this.func, this._commandBus));
  }
}

class RunTransactionSubscriber<T extends OrchestratorContext> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    private func: Transaction,
    private _commandBus: CommandBus,
  ) {
    super(destination);
  }
  protected async _next(context: T) {
    try {
      const command = this.func(context);
      const commandHandler = this._commandBus.getHandler(command);
      const commandResult = await this._commandBus.execute(command);
      context.setCommandResult(command, commandResult);
      context.pushCommandHandler(command, commandHandler);
      this.destination.next(context);
    } catch (err) {
      this.destination.error(err);
      return;
    }
  }
}
