import {
  Observable,
  Subscriber,
  Operator,
  TeardownLogic,
} from 'rxjs';
import { OrchestratorContext, OrchestratorMonoTypeOperatorFunction } from '../lib';

export type TransactionFinalizer = (context: OrchestratorContext) => any;

export function finalizeTransaction<TInput extends OrchestratorContext, TOutput>(func: TransactionFinalizer): OrchestratorMonoTypeOperatorFunction<TInput> {
  return function runTransactionOperatorFunction(source: Observable<any>) {
    return source.lift(new FinalizeTransactionOperator(func));
  }
}

class FinalizeTransactionOperator<T extends OrchestratorContext> implements Operator<T, T>{
  constructor(
    private func: TransactionFinalizer,
  ) {
  }
  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new FinalizeTransactionSubscriber(subscriber, this.func));
  }
}

class FinalizeTransactionSubscriber<T extends OrchestratorContext> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    private func: TransactionFinalizer,
  ) {
    super(destination);
  }
  protected async _next(context: T) {
    try {
      const result = this.func(context);
      this.destination.next(result);
      context.complete();
    } catch (err) {
      this.destination.error(err);
      return;
    }
  }
}
