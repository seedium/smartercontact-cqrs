export interface Serializable<T = unknown> {
  toJson(): string;
}
