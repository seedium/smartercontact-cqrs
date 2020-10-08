import { ICommand } from './command.interface';
import { Type } from './type';

export interface ICommandHandler<Result = unknown, ErrorResult = unknown> {
  command: Type<ICommand>;
  execute(command: ICommand): Promise<Result> | Result;
  onFail?(command: ICommand): Promise<void> | void;
}
