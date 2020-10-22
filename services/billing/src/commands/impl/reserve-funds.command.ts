import { Command } from 'core';
import { Balance } from '../../models';

export class ReserveFundsCommand extends Command {
  private _balanceAggregate: Balance;
  get balanceAggregate() {
    return this._balanceAggregate;
  }
  set balanceAggregate(balance: Balance) {
    this._balanceAggregate = balance;
  }
  public previousAmount: number;
  constructor(
    public readonly idUser: string,
    public readonly amount: number,
  ) {
    super()
  }
}
