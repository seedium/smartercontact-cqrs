import { ITemplateEngineService } from '../interfaces';

export class TemplateEngineService implements ITemplateEngineService {
  private templates = {
    welcome_user: 'Welcome to CQRS example',
    user_fail_register: 'User was register with fail',
    user_balance_created: 'Balance for user was created successfully',
    user_marketing: 'You have received this email because you included in campaign contacts',
    admin_campaign_completed: 'Campaign for user has just completed',
  };

  public async compile(template: string) {
    const templateString = this.templates[template];
    return {
      text: templateString,
      html: templateString,
    }
  }
}
