import { EventPublisher, ICommandHandler } from 'core';
import { Email } from '../../models';
import { SendEmailCommand } from '../impl';
import { EmailService } from '../../services';

export class SendEmailCommandHandler implements ICommandHandler<boolean> {
  public command = SendEmailCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _emailService: EmailService,
  ) {}
  public async execute(command: SendEmailCommand) {
    const result = await this._emailService.sendEmail({
      to: this.castRecipientToArray(command.options.to),
      template: command.options.template,
      subject: command.options.subject,
    });
    const emailAggregate = this._eventPublisher.mergeObjectContext(
      new Email(),
    );
    await emailAggregate.emailSent(result);
    return true;
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
