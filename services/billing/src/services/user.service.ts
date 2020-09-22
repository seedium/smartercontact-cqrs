import { User } from 'protos/user/entities/user.entity_pb';
import { UserServiceClient } from 'protos/user/service_grpc_pb';
import { RetrieveUserOptions } from 'protos/user/api/retrieve-user_pb';

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
