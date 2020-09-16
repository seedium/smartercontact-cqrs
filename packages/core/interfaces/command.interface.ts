import { Serializable } from './serializable';

export interface ICommand extends Serializable {
  command: string;
  id: string;
}
