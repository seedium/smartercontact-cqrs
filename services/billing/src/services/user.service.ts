import { User, UserServiceClient, RetrieveUserOptions } from 'protos';

export class UserService {
  constructor(private readonly _userServiceClient: UserServiceClient) {
  }
  public async retrieveUser(idUser: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const request = new RetrieveUserOptions();
      request.setIdUser(idUser);
      this._userServiceClient.retrieve(request, (err, user) => {
        if (err) {
          return reject(err);
        }
        return resolve(user.getUser());
      });
    });
  }
}
