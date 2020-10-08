export interface ISendEmailCommandOptions {
  to: string | string[];
  subject: string;
  template: string;
}
