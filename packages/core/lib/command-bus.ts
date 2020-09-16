import { ICommand, ICommandHandler, Type } from '../interfaces';

export class CommandBus {
  private readonly _map = new Map<string, ICommandHandler[]>();
  public registerHandler(handler: ICommandHandler) {
    const commandName = this.getCommandName(handler.command);
    let handlers = this._map.get(commandName);
    if (!handlers) {
      handlers = [];
    }
    handlers.push(handler);
    this._map.set(commandName, handlers);
  }
  public async execute(command: ICommand) {
    const commandName = this.getCommandName(command);
    const handlers = this._map.get(commandName);
    if (!handlers) {
      throw new Error(`${commandName} doesn't have any handlers`);
    }
    await Promise.all(handlers.map((handler) => handler.execute(command)));
  }
  protected getCommandName(command: Type<ICommand> | ICommand): string {
    if (command instanceof Function) {
      return command.name;
    } else {
      return command.constructor.name;
    }
  }
}
