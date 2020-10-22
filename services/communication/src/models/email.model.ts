import { v4 } from 'uuid';
import { AggregateRoot } from 'core';
import { EmailSentEvent, EmailSentFailEvent } from '@sc/events';
import { EmailSentResult } from 'protos';

export class Email extends AggregateRoot {
  constructor(transactionId = v4()) {
    super(transactionId);
  }
  public async emailSent(result: EmailSentResult) {
    await this.apply(new EmailSentEvent(result));
  }
  public async sendEmailFail() {
    await this.apply(new EmailSentFailEvent());
  }
}
