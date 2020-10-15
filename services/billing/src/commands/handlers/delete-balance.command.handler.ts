import { EventPublisher, ICommandHandler } from 'core';
import { DeleteBalanceCommand } from '../impl';
import { Balance } from '../../models';
import { BalanceRepository } from '../../repositories';

export class DeleteBalanceCommandHandler implements ICommandHandler {
  public command = DeleteBalanceCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _balanceRepository: BalanceRepository,
  ) {
  }
  public async execute(command: DeleteBalanceCommand) {
    const balance = await this._balanceRepository.retrieveByUser(command.idUser);
    if (!balance) {
      throw new Error(`Balance for user "${command.idUser}" doesn't exists`);
    }
    const balanceAggregate: Balance = this._eventPublisher.mergeObjectContext(
      new Balance(balance),
    );
    await balanceAggregate.delete();
  }
}
