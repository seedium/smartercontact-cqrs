import { IOrchestratorHandler, Type } from '../interfaces';
import { CommandBus } from './command-bus';
import { OrchestratorContext } from './orchestrator-context';
import { TransactionObservable } from './transaction-observable';

export class OrchestratorBus<T> {
  private readonly _map = new Map<string, IOrchestratorHandler>();

  constructor(
    private readonly _commandBus: CommandBus,
  ) {}
  public registerOrchestrator(orchestratorHandler: IOrchestratorHandler) {
    const orchestratorName = this.getOrchestratorName(orchestratorHandler.orchestrator);
    let handler = this._map.get(orchestratorName);
    if (handler) {
      console.log(`You will overwrite an orchestrator "${orchestratorName}"`);
    }
    this._map.set(orchestratorName, orchestratorHandler);
  }
  public async execute<T = unknown>(orchestratorCommand: any): Promise<T> {
    const orchestratorName = this.getOrchestratorName(orchestratorCommand);
    const handler = this._map.get(orchestratorName);
    if (!handler) {
      throw new Error(`Orchestrator "${orchestratorName}" doesn't have any handlers`);
    }
    const transactionObservable = new TransactionObservable(this._commandBus);
    const context = new OrchestratorContext(transactionObservable.subject$);
    try {
      const stream$ = handler.execute(orchestratorCommand, transactionObservable);
      const result = stream$.toPromise();
      transactionObservable.subject$.next(context);
      return await result;
    } catch (err) {
      await context.runCompensationTransactions();
      throw err;
    }
  }
  protected getOrchestratorName(orchestrator: Type<any> | any): string {
    if (orchestrator instanceof Function) {
      return orchestrator.name;
    } else {
      return orchestrator.constructor.name;
    }
  }
}
