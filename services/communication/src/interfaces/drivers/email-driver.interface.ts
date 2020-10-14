import { ISendEmailDriverOptions } from '../services';

export interface IEmailDriver<T> {
  sendEmail(options: ISendEmailDriverOptions): Promise<T> | T;
}
