import { CommunicationServiceClient, SendEmailToContactOptions } from 'protos';

export class CommunicationService {
  constructor(
    private readonly _communicationServiceClient: CommunicationServiceClient,
  ) {
  }
  public async sendEmailToContact(email: string): Promise<string[]> {
    const request = new SendEmailToContactOptions();
    request.setEmail(email);
    return new Promise((resolve, reject) => {
      this._communicationServiceClient.sendEmailToContact(request, (err, response) => {
        if (err) {
          return reject(err);
        }
        return resolve(response.getAcceptedList());
      });
    });
  }
}
