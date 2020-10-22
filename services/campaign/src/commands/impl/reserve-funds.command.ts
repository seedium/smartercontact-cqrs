import { Command } from 'core';
import { Campaign } from 'protos';

export class ReserveFundsCommand extends Command {
  public amount: number;
  constructor(
    public readonly idUser: string,
    public readonly campaign: Campaign,
  ) {
    super();
  }
}
