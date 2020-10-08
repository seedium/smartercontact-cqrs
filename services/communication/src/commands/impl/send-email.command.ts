import { Command } from 'core';
import { ISendEmailCommandOptions } from '../../interfaces/commands';

export class SendEmailCommand extends Command {
  constructor(public readonly options: ISendEmailCommandOptions) {
    super();
  }
}
