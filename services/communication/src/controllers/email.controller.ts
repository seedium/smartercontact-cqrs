import { EmailSentResult, SendEmailToContactOptions, SendEmailToContactResponse } from 'protos';
import { CommandBus } from '../../../../packages/core/lib';
import { SendEmailCommand } from '../commands/impl';

export class EmailController {
  constructor(
    private readonly _commandBus: CommandBus,
  ) {}
  public async sendEmailToContact(req: SendEmailToContactOptions): Promise<SendEmailToContactResponse> {
    const response = new SendEmailToContactResponse();
    const result = await this._commandBus.execute<EmailSentResult>(
      new SendEmailCommand({
        to: req.getEmail(),
        subject: 'Email marketing',
        template: 'user_marketing',
      }),
    );
    response.setAcceptedList(result.getAcceptedList());
    return response;
  }
}
