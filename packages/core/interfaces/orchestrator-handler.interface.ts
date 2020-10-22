import { Observable } from 'rxjs';
import { OrchestratorContext, TransactionObservable } from '../lib';
import { IOrchestrator } from './orchestrator.interface';

export interface IOrchestratorHandler {
  orchestrator: any;
  execute(orchestrator: IOrchestrator, transactions$: TransactionObservable): Observable<any>;
  onFail?(orchestrator: IOrchestrator, context: OrchestratorContext): Promise<void> | void;
}
