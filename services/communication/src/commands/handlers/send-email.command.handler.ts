import { EventPublisher, ICommandHandler } from 'core';
import { EmailSentResult, Envelope } from 'protos';
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
    let to: string;
    if (typeof command.options.to === 'string') {
      to = command.options.to;
    } else {
      to = command.options.to.join(', ');
    }
    const result = await this._emailService.sendEmail({
      to,
      template: command.options.template,
      subject: command.options.subject,
    });
    const emailSentResult = new EmailSentResult();
    emailSentResult.setAcceptedList(result.accepted);
    emailSentResult.setRejectedList(result.rejected);
    emailSentResult.setEnvelopeTime(result.envelopeTime);
    emailSentResult.setResponse(result.response);
    emailSentResult.setMessageid(result.messageId);
    const envelope = new Envelope();
    envelope.setFrom(result.envelope.from);
    envelope.setToList(result.envelope.to);
    emailSentResult.setEnvelope(envelope);

    const emailAggregate = this._eventPublisher.mergeObjectContext(
      new Email(),
    );
    await emailAggregate.sendEmail(emailSentResult);
    return true;
  }
  public async onFail() {
    const emailAggregate = this._eventPublisher.mergeObjectContext(
      new Email(),
    );
    await emailAggregate.sendEmailFail();
  }
}
