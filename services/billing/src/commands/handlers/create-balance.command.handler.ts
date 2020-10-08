import { Balance as BalanceProto } from 'protos';
import { EventPublisher, ICommandHandler } from 'core';
import { CreateBalanceCommand } from '../impl';
import { Balance } from '../../models';

export class CreateBalanceCommandHandler implements ICommandHandler<BalanceProto> {
  public command = CreateBalanceCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
  ) {}
  public async execute(command: CreateBalanceCommand) {
    const balanceDto = this.createEmptyDto(command.idUser);
    const balance = this._eventPublisher.mergeObjectContext(
      new Balance(balanceDto),
    );
    await balance.create();
    return balance.balance;
  }
  public async onFail(command: CreateBalanceCommand) {
    const balanceDto = this.createEmptyDto(command.idUser);
    const balance = this._eventPublisher.mergeObjectContext(
      new Balance(balanceDto),
    );
    await balance.createFail();
  }
  private createEmptyDto(idUser: string): BalanceProto {
    const balanceDto = new BalanceProto();
    balanceDto.setUser(idUser);
    balanceDto.setAmount(0);
    balanceDto.setCurrency('usd');
    balanceDto.setCreated(Date.now());
    return balanceDto;
  }
}
