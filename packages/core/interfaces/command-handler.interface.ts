import { ICommand } from './command.interface';
import { Type } from './type';

export interface ICommandHandler {
  command: Type<ICommand>;
  execute(...args: unknown[]): Promise<unknown> | unknown;
}
