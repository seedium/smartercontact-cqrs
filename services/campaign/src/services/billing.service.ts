import { BillingServiceClient, ReserveFundsOptions } from 'protos';

export class BillingService {
  constructor(
    private readonly _billingServiceClient: BillingServiceClient,
  ) {}
  public async reserveFunds(idUser: string, amount: number): Promise<boolean> {
    const request = new ReserveFundsOptions();
    request.setUser(idUser);
    request.setAmount(amount);
    return new Promise((resolve, reject) => {
      this._billingServiceClient.reserveFunds(request, (err, response) => {
        if (err) {
          return resolve(false);
        }
        return resolve(response.getResult());
      });
    });
  }
  public async reserveFundsRollback(idUser: string, amount: number): Promise<boolean> {
    const request = new ReserveFundsOptions();
    request.setUser(idUser);
    request.setAmount(amount);
    return new Promise((resolve, reject) => {
      this._billingServiceClient.reserveFundsRollback(request, (err, response) => {
        if (err) {
          return reject(false);
        }
        return resolve(response.getResult());
      });
    });
  }
}
