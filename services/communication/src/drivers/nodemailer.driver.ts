import * as nodemailer from 'nodemailer';
import { IEmailDriver } from '../interfaces/drivers';
import { ISendEmailDriverOptions } from '../interfaces/services';

export class NodemailerDriver implements IEmailDriver<nodemailer.SentMessageInfo> {
  private readonly _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  public async sendEmail(options: ISendEmailDriverOptions) {
    const to = options.to.join(', ');
    return this._transporter.sendMail({
      to,
      ...options,
    });
  }
}
