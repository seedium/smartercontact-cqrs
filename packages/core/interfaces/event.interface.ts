import { Serializable } from './serializable';
import { Type } from './type';

export interface IEvent extends Serializable<IEvent> {
   event: string;
}

export interface IEventStatic<T extends IEvent> extends Type<T> {
   event: string;
   fromProto(message: Uint8Array): T;
}
