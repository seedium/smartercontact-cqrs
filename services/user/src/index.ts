import { RpcApp, CommandBus, EventPublisher, EventBus, QueryBus, rpcController } from 'core';
import { UserServiceService } from 'protos';
import { UserMapper } from 'mappers';
import { commandDb, viewDb } from './lib';
import { UserRepository } from './repositories';
import { UserController } from './controllers';
import { UserCreateCommandHandler, UserDeleteCommandHandler } from './commands/handlers';
import { UserCreatedEventHandler, UserDeletedEventHandler } from './events/handlers';
import { GetUsersQueryHandler, RetrieveUserQueryHandler } from './queries/handlers';

const start = async () => {
  const app = new RpcApp();
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);

    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const eventBus = new EventBus();
    const eventPublisher = new EventPublisher(eventBus);
    const userMapper = new UserMapper();

    // repositories
    const userRepository = new UserRepository(userMapper);

    // controllers
    const userController = new UserController(commandBus, queryBus);

    commandBus.registerHandler(new UserCreateCommandHandler(eventPublisher, userRepository));
    commandBus.registerHandler(new UserDeleteCommandHandler(eventPublisher, userRepository));
    queryBus.registerQuery(new GetUsersQueryHandler(userRepository));
    queryBus.registerQuery(new RetrieveUserQueryHandler(userRepository));
    await Promise.all([
      new UserCreatedEventHandler(userRepository),
      new UserDeletedEventHandler(userRepository),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`user.${event.event.event}`, event)),
    );

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
