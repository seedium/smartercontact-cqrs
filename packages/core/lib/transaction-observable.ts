import { identity, Observable } from 'rxjs';
import { ObservableBus } from './observable-bus';
import { CommandBus } from './command-bus';

export interface OrchestratorUnaryFunction<T, R> { (source: T, commandBus: CommandBus): R; }

export interface OrchestratorOperatorFunction<T, R> extends OrchestratorUnaryFunction<Observable<T>, Observable<R>> {}

export interface OrchestratorMonoTypeOperatorFunction<T> extends OrchestratorOperatorFunction<T, T> {}

export class TransactionObservable extends ObservableBus<any> {
  constructor(private readonly _commandBus: CommandBus) {
    super();
  }
  public pipe(...operations: OrchestratorOperatorFunction<any, any>[]): Observable<any> {
    if (operations.length === 0) {
      return this as any;
    }

    return this.pipeFromArray(operations)(this);
  }
  public pipeFromArray<T, R>(fns: Array<OrchestratorUnaryFunction<T, R>>): any {
    if (fns.length === 0) {
      return identity as OrchestratorUnaryFunction<any, any>;
    }

    if (fns.length === 1) {
      return fns[0];
    }

    const commandBus = this._commandBus;

    return function piped(input: T): R {
      return fns.reduce((prev: any, fn: OrchestratorUnaryFunction<T, R>) => fn(prev, commandBus), input as any);
    };
  }
}
