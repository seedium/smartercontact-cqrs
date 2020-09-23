import { RpcApp, CommandBus, EventPublisher, EventBus, QueryBus, rpcController } from 'core';
import * as grpc from 'grpc';
import { UserServiceClient, BillingServiceService } from 'protos';
import { commandDb, viewDb } from './lib';
import { BalanceController, CardController } from './controllers';
import { BalanceRepository, CardRepository } from './repositories';
import { ListCardsQueryHandler, RetrieveBalanceQueryHandler } from './queries/handlers';
import { BalanceCreatedEventHandler, BalanceDeletedEventHandler, CardCreatedEventHandler } from './events/billing/handlers';
import { UserCreatedEventHandler, UserDeletedEventHandler } from './events/user/handlers';
import { BalanceMapper, CardMapper } from 'mappers';
import { CreateUserCardCommandHandler } from './commands/handlers';
import { UserService } from './services';

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
    const balanceMapper = new BalanceMapper();
    const cardMapper = new CardMapper();

    // repositories
    const balanceRepository = new BalanceRepository(balanceMapper);
    const cardRepository = new CardRepository(cardMapper);
    const userServiceClient = new UserServiceClient('localhost:3000', grpc.credentials.createInsecure());
    const userService = new UserService(userServiceClient);

    // controllers
    const balanceController = new BalanceController(queryBus);
    const cardController = new CardController(commandBus, queryBus);

    queryBus.registerQuery(new ListCardsQueryHandler(cardRepository));
    queryBus.registerQuery(new RetrieveBalanceQueryHandler(balanceRepository));
    commandBus.registerHandler(new CreateUserCardCommandHandler(eventPublisher, cardRepository, userService));
    await Promise.all([
      new UserCreatedEventHandler(eventPublisher),
      new UserDeletedEventHandler(eventPublisher, balanceRepository),
      new BalanceCreatedEventHandler(balanceRepository),
      new BalanceDeletedEventHandler(balanceRepository),
      new CardCreatedEventHandler(cardRepository),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`billing.${event.event.event}`, event)),
    );
    app.server.addService(BillingServiceService, {
      retrieveBalance: rpcController(balanceController.retrieveBalance.bind(balanceController)),
      createCard: rpcController(cardController.create.bind(balanceController)),
      listCard: rpcController(cardController.list.bind(cardController)),
    })
    app.start();
  } catch (err) {
    app.logger.error(err);
    process.exit(1);
  }

};
start();
