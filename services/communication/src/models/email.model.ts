import { AggregateRoot } from 'core';
import { EmailSentEvent, EmailSentFailEvent } from '@sc/events';
import { EmailSentResult } from 'protos';

export class Email extends AggregateRoot {
  public async sendEmail(result: EmailSentResult) {
    await this.apply(new EmailSentEvent(result));
  }
  public async sendEmailFail() {
    await this.apply(new EmailSentFailEvent());
  }
}
