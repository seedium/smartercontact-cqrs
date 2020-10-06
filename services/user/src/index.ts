import { RpcApp, CommandBus, EventPublisher, EventBus, QueryBus, rpcController } from 'core';
import { UserServiceService } from 'protos';
import { UserMapper } from 'mappers';
import { commandDb, viewDb } from './lib';
import { UserRepository } from './repositories';
import { UserController } from './controllers';
import {
  UserCreateCommandHandler,
  UserCreateRollbackCommandHandler,
  UserDeleteCommandHandler,
} from './commands/handlers';
import {
  UserCreatedEventHandler,
  UserCreatedFailEventHandler,
  UserDeletedEventHandler,
  UserDeletedFailEventHandler,
  BalanceCreatedFailEventHandler,
} from './events';
import { GetUsersQueryHandler, RetrieveUserQueryHandler } from './queries/handlers';
import { UserSaga } from './sagas';

const start = async () => {
  const app = new RpcApp();
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);

    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const eventBus = new EventBus(commandBus);
    const eventPublisher = new EventPublisher(eventBus);
    const userMapper = new UserMapper();

    // repositories
    const userRepository = new UserRepository(userMapper);

    // controllers
    const userController = new UserController(commandBus, queryBus);

    // sagas
    const userSaga = new UserSaga();

    commandBus.registerHandler(new UserCreateCommandHandler(eventPublisher, userRepository));
    commandBus.registerHandler(new UserCreateRollbackCommandHandler(eventPublisher, userRepository));
    commandBus.registerHandler(new UserDeleteCommandHandler(eventPublisher, userRepository));
    queryBus.registerQuery(new GetUsersQueryHandler(userRepository));
    queryBus.registerQuery(new RetrieveUserQueryHandler(userRepository));
    await Promise.all([
      new UserCreatedEventHandler(userRepository),
      new UserCreatedFailEventHandler(userRepository),
      new UserDeletedEventHandler(userRepository),
      new UserDeletedFailEventHandler(userRepository),
      new BalanceCreatedFailEventHandler(),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`user.${event.event.event}`, event)),
    );
    eventBus.registerSaga(userSaga.balanceCreatedFail);

    app.server.addService(UserServiceService, {
      retrieve: rpcController(userController.retrieve.bind(userController)),
      create: rpcController(userController.create.bind(userController)),
      list: rpcController(userController.list.bind(userController)),
      delete: rpcController(userController.delete.bind(userController)),
    });
    app.start();
  } catch (err) {
    app.logger.error(err);
    process.exit(1);
  }
};
start();
