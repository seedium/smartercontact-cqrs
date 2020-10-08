import * as nodemailer from 'nodemailer';
import { ISendEmailOptions, ITemplateEngineService } from '../interfaces';

export class EmailService {
  private readonly _transporter: nodemailer.Transporter;

  constructor(
    private readonly _templateEngine: ITemplateEngineService,
  ) {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  public async sendEmail(options: ISendEmailOptions) {
    const { text, html } = await this._templateEngine.compile(options.template);
    return await this._transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      text,
      html,
    });
  }
}
