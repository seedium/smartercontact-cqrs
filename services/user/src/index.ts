import { RpcApp, CommandBus, EventPublisher, EventBus, QueryBus, rpcController, MongoEventStore } from 'core';
import { UserServiceService } from 'protos';
import { UserMapper } from 'mappers';
import { commandDb, viewDb } from './lib';
import { UserRepository } from './repositories';
import { UserController } from './controllers';
import {
  UserCreateCommandHandler,
  UserCreateRollbackCommandHandler,
  UserDeleteCommandHandler,
  UserDeleteRollbackCommandHandler,
} from './commands/handlers';
import {
  UserCreatedEventHandler,
  UserCreatedFailEventHandler,
  UserDeletedEventHandler,
  UserDeletedFailEventHandler,
  BalanceCreatedFailEventHandler,
  ContactCreatedFailEventHandler,
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
    const userEventCollection = commandDb.db('cqrs_command').collection('user_events');
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const eventBus = new EventBus(commandBus);
    const userEventPublisher = new EventPublisher(eventBus, new MongoEventStore(userEventCollection));
    const userMapper = new UserMapper();

    // repositories
    const userRepository = new UserRepository(userMapper);

    // controllers
    const userController = new UserController(commandBus, queryBus);

    // sagas
    const userSaga = new UserSaga();

    commandBus.registerHandler(new UserCreateCommandHandler(userEventPublisher, userRepository));
    commandBus.registerHandler(new UserCreateRollbackCommandHandler(userEventPublisher, userRepository));
    commandBus.registerHandler(new UserDeleteCommandHandler(userEventPublisher, userRepository));
    commandBus.registerHandler(new UserDeleteRollbackCommandHandler(userEventPublisher, userRepository));

    queryBus.registerQuery(new GetUsersQueryHandler(userRepository));
    queryBus.registerQuery(new RetrieveUserQueryHandler(userRepository));

    await Promise.all([
      new UserCreatedEventHandler(userEventPublisher, userRepository),
      new UserCreatedFailEventHandler(userRepository),
      new UserDeletedEventHandler(userRepository),
      new UserDeletedFailEventHandler(userRepository),
      new BalanceCreatedFailEventHandler(),
      new ContactCreatedFailEventHandler(),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`user`, event)),
    );
    eventBus.registerSaga(userSaga.userCreatedFail);
    eventBus.registerSaga(userSaga.balanceCreatedFail);
    eventBus.registerSaga(userSaga.contactCreatedFail);

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
