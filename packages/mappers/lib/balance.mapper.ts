import { DataMapper } from 'core';
import { Balance } from 'protos/billing/entities/balance.entity_pb';
import type { Balance as BalanceDto } from 'protos/billing/entities/balance.entity_pb';

export class BalanceMapper extends DataMapper<Balance, BalanceDto.AsObject> {
  public readonly map = {
    Id: 'id',
    Amount: 'amount',
    Created: 'created',
    Currency: 'currency',
    User: 'user',
  };
  public readonly entity = Balance;
}
