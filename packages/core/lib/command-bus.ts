import { ICommand, ICommandHandler, Type } from '../interfaces';

export class CommandBus {
  private readonly _map = new Map<string, ICommandHandler>();
  public registerHandler(commandHandler: ICommandHandler) {
    const commandName = this.getCommandName(commandHandler.command);
    let handler = this._map.get(commandName);
    if (handler) {
      console.log(`You will overwrite ${commandName}`);
    }
    this._map.set(commandName, commandHandler);
  }
  public async execute<T = unknown>(command: ICommand): Promise<T> {
    const commandName = this.getCommandName(command);
    const handler = this._map.get(commandName);
    if (!handler) {
      throw new Error(`${commandName} doesn't have any handlers`);
    }
    try {
      return await handler.execute(command) as T;
    } catch (err) {
      if (handler.onFail) {
        await handler.onFail(command);
      }
      throw err;
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
