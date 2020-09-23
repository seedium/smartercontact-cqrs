import { Type } from 'core';
import { IDataMapper } from './interfaces';

export class DataMapper<Entity = unknown, EntityDto = unknown> implements IDataMapper<Entity, EntityDto> {
  public readonly map: Record<string, string>;
  public readonly entity: Type<any>;
  fromObject(dto: any): Entity {
    const user = new this.entity();
    Object.entries(this.map).forEach(([key, dtoKey]) => {
      user[`set${key}`](dto[dtoKey]);
    });
    return user;
  }
  fromArray(arrayDto: unknown[]): Entity[] {
    return arrayDto.map((user) => this.fromObject(user));
  }
  toObject(entity: Entity): EntityDto {
    let entityDto: Partial<EntityDto> = {};
    Object.entries(this.map).forEach(([key, dtoKey]) => {
      entityDto[dtoKey] = entity[`get${key}`]();
    });
    return entityDto as EntityDto;
  }
  toArray(arrayEntities: Entity[]): EntityDto[] {
    return arrayEntities.map((user) => this.toObject(user));
  }
}
