import { EventPublisher, ICommandHandler } from 'core';
import { EmailSentResult } from 'protos';
import { Email } from '../../models';
import { SendEmailCommand } from '../impl';
import { EmailService } from '../../services';

export class SendEmailCommandHandler implements ICommandHandler<EmailSentResult> {
  public command = SendEmailCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _emailService: EmailService,
  ) {}
  public async execute(command: SendEmailCommand): Promise<EmailSentResult> {
    const result = await this._emailService.sendEmail({
      to: this.castRecipientToArray(command.options.to),
      template: command.options.template,
      subject: command.options.subject,
    });
    const emailAggregate = this._eventPublisher.mergeObjectContext(
      new Email(),
    );
    await emailAggregate.emailSent(result);
    return result;
  }
  public async onFail() {
    const emailAggregate = this._eventPublisher.mergeObjectContext(
      new Email(),
    );
    await emailAggregate.sendEmailFail();
  }
  private castRecipientToArray(to: string | string[]): string[] {
    if (typeof to === 'string') {
      return [to];
    }
    return to;
  }
}
