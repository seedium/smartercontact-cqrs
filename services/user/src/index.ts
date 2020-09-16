import { App, CommandBus, EventPublisher, EventBus } from 'core';
import { commandDb, viewDb } from './lib';
import { UserRepository } from './repositories';
import { UserController } from './controllers';
import { UserCreateCommandHandler } from './commands/handlers';
import { UserCreatedEventHandler } from './events/handlers';

const start = async () => {
  const app = new App();
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    const eventPublisher = new EventPublisher(eventBus);

    // repositories
    const userRepository = new UserRepository();

    // controllers
    const userController = new UserController(commandBus);

    await commandBus.registerHandler(new UserCreateCommandHandler(eventPublisher));
    await eventBus.registerEventHandler('user-user.created', new UserCreatedEventHandler(userRepository));

    app.server.log.info('Successfully connected to view and command databases');

    app.server.get('/users', userController.getAll.bind(userController));
    app.server.post('/users', userController.create.bind(userController));

    await app.start();
  } catch (err) {
    app.server.log.error(err);
    process.exit(1);
  }
};
start();
