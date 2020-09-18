import { App, CommandBus, EventPublisher, EventBus, QueryBus } from 'core';
import { commandDb, viewDb } from './lib';
import { UserRepository } from './repositories';
import { UserController } from './controllers';
import { UserCreateCommandHandler, UserDeleteCommandHandler } from './commands/handlers';
import { UserCreatedEventHandler, UserDeletedEventHandler } from './events/handlers';
import { GetUsersQueryHandler } from './queries/handlers';

const start = async () => {
  const app = new App();
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);
    app.server.log.info('Successfully connected to view and command databases');

    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const eventBus = new EventBus();
    const eventPublisher = new EventPublisher(eventBus);

    // repositories
    const userRepository = new UserRepository();

    // controllers
    const userController = new UserController(commandBus, queryBus);

    commandBus.registerHandler(new UserCreateCommandHandler(eventPublisher, userRepository));
    commandBus.registerHandler(new UserDeleteCommandHandler(eventPublisher, userRepository));
    queryBus.registerQuery(new GetUsersQueryHandler(userRepository));
    const userCreatedEventHandler = new UserCreatedEventHandler(userRepository);
    const userDeletedEventHandler = new UserDeletedEventHandler(userRepository);
    await eventBus.registerEventHandler(`user-${userCreatedEventHandler.event.event}`, userCreatedEventHandler);
    await eventBus.registerEventHandler(`user-${userDeletedEventHandler.event.event}`, userDeletedEventHandler);

    app.server.get('/users', userController.getAll.bind(userController));
    app.server.post('/users', userController.create.bind(userController));
    app.server.delete('/users/:idUser', userController.delete.bind(userController));

    await app.start();
  } catch (err) {
    app.server.log.error(err);
    process.exit(1);
  }
};
start();
