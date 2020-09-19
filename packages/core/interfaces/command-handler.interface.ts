import { ICommand } from './command.interface';
import { Type } from './type';

export interface ICommandHandler<T = unknown> {
  command: Type<ICommand>;
  execute(...args: unknown[]): Promise<T> | T;
}
