import { ICommand } from './command.interface';
import { Type } from './type';

export interface ICommandHandler<Result = unknown> {
  command: Type<ICommand>;
  execute(command: ICommand): Promise<Result> | Result;
  rollback?(command: ICommand): Promise<void> | void;
}
