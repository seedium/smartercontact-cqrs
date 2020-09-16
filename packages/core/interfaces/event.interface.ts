import { Serializable } from './serializable';

export interface IEvent extends Serializable<IEvent> {
  event: string;
}
