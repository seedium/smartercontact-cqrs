interface ITemplateResult {
  text: string;
  html: string;
}
export interface ITemplateEngineService {
  compile(templateName: string): Promise<ITemplateResult> | ITemplateResult;
}
