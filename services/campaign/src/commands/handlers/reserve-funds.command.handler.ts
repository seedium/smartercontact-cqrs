import { ICommandHandler } from 'core';
import { ReserveFundsCommand } from '../impl';
import { BillingService } from '../../services';

export class ReserveFundsCommandHandler implements ICommandHandler {
  public command = ReserveFundsCommand;
  constructor(
    private readonly _billingService: BillingService,
  ) {}
  public async execute(command: ReserveFundsCommand) {
    const costPerContact = 0.15;
    const totalContactsCost = command.campaign.getContactsList().length * costPerContact;
    command.amount = totalContactsCost;
    const areFundsReserved = await this._billingService.reserveFunds(command.idUser, totalContactsCost);

    if (!areFundsReserved) {
      throw new Error('Funds are not reserved');
    }

    return areFundsReserved;
  }
  public async onFail(command: ReserveFundsCommand) {
    await this._billingService.reserveFundsRollback(command.idUser, command.amount);
  }
}
