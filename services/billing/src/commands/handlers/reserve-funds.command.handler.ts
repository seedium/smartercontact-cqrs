import { EventPublisher, ICommandHandler } from 'core';
import { Balance as BalanceProto } from 'protos';
import { ReserveFundsCommand } from '../impl';
import { BalanceRepository } from '../../repositories';
import { Balance } from '../../models';

export class ReserveFundsCommandHandler implements ICommandHandler<boolean> {
  public command = ReserveFundsCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async execute(command: ReserveFundsCommand) {
    const balance = await this._balanceRepository.retrieveByUser(command.idUser);
    if (!balance) {
      throw new Error(`Balance for user "${command.idUser}" doesn't exists`);
    }
    const balanceAggregate = this._eventPublisher.mergeObjectContext(
      new Balance(balance, command.id)
    );
    const currentBalance = balanceAggregate.balance.getAmount() || 0;
    command.balanceAggregate = balanceAggregate;
    command.previousAmount = currentBalance;
    balanceAggregate.balance.setAmount(currentBalance - command.amount);
    await balanceAggregate.reserveFunds();
    return true;
  }
  public async onFail(command: ReserveFundsCommand) {
    let balanceAggregate: Balance = command.balanceAggregate;
    if (!balanceAggregate) {
      balanceAggregate = this._eventPublisher.mergeObjectContext(
        new Balance(new BalanceProto(), command.id),
      );
    }
    balanceAggregate.balance.setAmount(command.previousAmount);
    await balanceAggregate.reserveFundsFail();
  }
}
