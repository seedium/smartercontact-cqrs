export interface Serializable {
  toJson(): string;
  toProto(): Uint8Array;
}
