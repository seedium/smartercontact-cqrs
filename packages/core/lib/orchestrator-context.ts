import { Subject } from 'rxjs';
import { ICommand, ICommandHandler, Type } from '../interfaces';

export class OrchestratorContext {
  private readonly _results = new Map<string, any>();
  private readonly _executedHandlers: {
    command: ICommand;
    handler: ICommandHandler;
  }[] = [];
  constructor(
    private readonly _subject$: Subject<any>,
  ) {
  }
  public setCommandResult(command: ICommand, result: any) {
    const commandName = this.getCommandName(command);
    this._results.set(commandName, result);
  }
  public pushCommandHandler(command: ICommand, commandHandler: ICommandHandler) {
    this._executedHandlers.push({
      command,
      handler: commandHandler,
    });
  }
  public getCommandResult<T = unknown>(command: Type<ICommand> | ICommand): T {
    const commandName = this.getCommandName(command);
    return this._results.get(commandName);
  }
  public complete() {
    this._subject$.complete();
  }
  public async runCompensationTransactions() {
    const reverseExecutedHandlers = this._executedHandlers.reverse();
    /* call compensation transaction on reverse order */
    for (const { handler, command } of reverseExecutedHandlers) {
      if (handler.onFail) {
        await handler.onFail(command);
      }
    }
  }
  protected getCommandName(command: Type<ICommand> | ICommand): string {
    if (command instanceof Function) {
      return command.name;
    } else {
      return command.constructor.name;
    }
  }
}
