export interface Serializable<T = unknown> {
  toJson(): string;
  toProto(): Uint8Array;
  fromProto?(): T;
}
