export interface ISendEmailOptions {
  to: string[];
  subject: string;
  template: string;
}

export interface ISendEmailDriverOptions {
  to: string[];
  from: string;
  subject: string;
  text: string;
  html: string;
}
