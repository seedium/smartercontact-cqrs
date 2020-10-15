import { Balance as BalanceProto } from 'protos';
import { EventPublisher, ICommandHandler } from 'core';
import { CreateBalanceRollbackCommand } from '../impl';
import { Balance } from '../../models';
import { BalanceRepository } from '../../repositories';

export class CreateBalanceRollbackCommandHandler implements ICommandHandler<BalanceProto> {
  public command = CreateBalanceRollbackCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _balanceRepository: BalanceRepository,
  ) {}
  public async execute(command: CreateBalanceRollbackCommand) {
    const balanceDto = await this._balanceRepository.retrieveByUser(command.idUser);
    if (!balanceDto) {
      return;
    }
    const balance = this._eventPublisher.mergeObjectContext(
      new Balance(balanceDto),
    );
    await balance.createRollback();
    return balance.balance;
  }
}
