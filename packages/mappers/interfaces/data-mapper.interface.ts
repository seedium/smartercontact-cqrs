export interface IDataMapper<Entity = unknown, EntityDto = unknown> {
  fromObject(object: any): Entity;
  fromArray(array: unknown[]): Entity[];
  toObject(object: Entity): EntityDto;
  toArray(array: Entity[]): EntityDto[];
}
