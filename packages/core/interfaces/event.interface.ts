import { Serializable } from './serializable';

export interface IEventPublisher extends Serializable {
   event: string;
}

export interface IEventSubscriber<T> {
   event: string;
   fromProto(message: Uint8Array): T;
}

export interface IEventSubscriberStatic<T> {
   new (...args: any[]): T;
   event: string;
}
