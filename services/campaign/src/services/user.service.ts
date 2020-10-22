import { UserServiceClient, CheckUserActiveOptions } from 'protos';

export class UserService {
  constructor(
    private readonly _userServiceClient: UserServiceClient,
  ) {}
  public isUserActive(idUser: string): Promise<boolean> {
    const request = new CheckUserActiveOptions();
    request.setIdUser(idUser);
    return new Promise((resolve, reject) => {
      this._userServiceClient.checkUserActive(request, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.getResult());
      });
    });
  }
}
