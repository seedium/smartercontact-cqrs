import { IOrchestratorHandler } from 'core';
import { Campaign } from 'protos';
import { runTransaction, TransactionObservable, finalizeTransaction } from 'core';
import {
  CheckUserActiveCommand,
  ReserveFundsCommand,
  CreateCampaignCommand,
  RunCampaignCommand,
} from '../../commands/impl';
import { CreateCampaignOrchestrator } from '../impl';

export class CreateCampaignOrchestratorHandler implements IOrchestratorHandler {
  public orchestrator = CreateCampaignOrchestrator;
  public execute({ idUser, contacts }: CreateCampaignOrchestrator, transactions$: TransactionObservable) {
    return transactions$
      .pipe(
        runTransaction(() => {
          return new CheckUserActiveCommand(idUser);
        }),
        runTransaction(() => {
          return new CreateCampaignCommand(idUser, contacts);
        }),
        runTransaction((context) => {
          const campaign = context.getCommandResult<Campaign>(CreateCampaignCommand);
          return new ReserveFundsCommand(idUser, campaign);
        }),
        runTransaction((context) => {
          const campaign = context.getCommandResult<Campaign>(CreateCampaignCommand);
          return new RunCampaignCommand(campaign);
        }),
        finalizeTransaction((context) => {
          return context.getCommandResult<Campaign>(RunCampaignCommand);
        }),
      );
  }
}
