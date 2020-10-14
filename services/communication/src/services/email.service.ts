import * as nodemailer from 'nodemailer';
import { EmailSentResult, Envelope } from 'protos';
import { IEmailDriver, ISendEmailOptions, ITemplateEngineService } from '../interfaces';

export class EmailService {
  constructor(
    private readonly _templateEngine: ITemplateEngineService,
    private readonly _driver: IEmailDriver<nodemailer.SentMessageInfo>,
  ) {}
  public async sendEmail(options: ISendEmailOptions): Promise<EmailSentResult> {
    const { text, html } = await this._templateEngine.compile(options.template);
    const result = await this._driver.sendEmail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      text,
      html,
    });
    const envelope = new Envelope();
    envelope.setFrom(result.envelope.from);
    envelope.setToList(result.envelope.to);

    const emailSentResult = new EmailSentResult();
    emailSentResult.setAcceptedList(result.accepted);
    emailSentResult.setRejectedList(result.rejected);
    emailSentResult.setEnvelopeTime(result.envelopeTime);
    emailSentResult.setResponse(result.response);
    emailSentResult.setMessageid(result.messageId);
    emailSentResult.setEnvelope(envelope);

    return emailSentResult;
  }
}
