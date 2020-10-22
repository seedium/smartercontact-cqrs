import { Command } from 'core';
import { Balance } from 'protos';

export class ReserveFundsRollbackCommand extends Command {
  constructor(
    public readonly balance: Balance | null,
    public readonly idUser?: string,
    public readonly amount?: number,
  ) {
    super()
  }
}
