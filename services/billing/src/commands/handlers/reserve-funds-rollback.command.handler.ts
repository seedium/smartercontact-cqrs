import { EventPublisher, ICommandHandler } from 'core';
import { ReserveFundsRollbackCommand } from '../impl';
import { Balance } from '../../models';
import { BalanceRepository } from '../../repositories';

export class ReserveFundsRollbackCommandHandler implements ICommandHandler<boolean> {
  public command = ReserveFundsRollbackCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async execute(command: ReserveFundsRollbackCommand) {
    let balance = command.balance;
    if (!balance) {
      balance = await this._balanceRepository.retrieveByUser(command.idUser);
      if (!balance) {
        throw new Error(`Balance for user "${command.idUser}" doesn't exists`);
      }
      balance.setAmount(balance.getAmount() + command.amount);
    }
    const balanceAggregate = this._eventPublisher.mergeObjectContext(
      new Balance(balance),
    );
    await balanceAggregate.reserveFundsRollback();
    return true;
  }
}
