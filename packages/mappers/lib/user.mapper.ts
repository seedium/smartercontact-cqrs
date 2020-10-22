import { DataMapper } from 'core';
import { User } from 'protos/user/entities/user.entity_pb';
import type { User as UserDto } from 'protos/user/entities/user.entity_pb';

export class UserMapper extends DataMapper<User, UserDto.AsObject> {
  public readonly map = {
    Id: 'id',
    Email: 'email',
    FirstName: 'first_name',
    LastName: 'last_name',
    Active: 'active',
  };
  public readonly entity = User;
}
