import { ITemplateEngineService } from '../interfaces';

export class TemplateEngineService implements ITemplateEngineService {
  private templates = {
    welcome_user: 'Welcome to CQRS example',
    user_fail_register: 'User was register with fail',
    user_balance_created: 'Balance for user was created successfully',
  };

  public async compile(template: string) {
    const templateString = this.templates[template];
    return {
      text: templateString,
      html: templateString,
    }
  }
}
