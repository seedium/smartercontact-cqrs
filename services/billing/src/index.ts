import { RpcApp, CommandBus, EventPublisher, EventBus, QueryBus, rpcController, MongoEventStore } from 'core';
import * as grpc from 'grpc';
import { UserServiceClient, BillingServiceService } from 'protos';
import { commandDb, viewDb } from './lib';
import { BalanceController, CardController } from './controllers';
import { BalanceRepository, CardRepository } from './repositories';
import { ListCardsQueryHandler, RetrieveBalanceQueryHandler } from './queries/handlers';
import { BalanceCreatedEventHandler, BalanceDeletedEventHandler, CardCreatedEventHandler } from './events/billing';
import { UserCreatedEventHandler, UserDeletedEventHandler } from './events/user';
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
    const balanceEventCollection = commandDb.db('cqrs_command').collection('balance_events');
    const cardEventCollection = commandDb.db('cqrs_command').collection('card_events');
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const eventBus = new EventBus(commandBus);
    const balanceEventPublisher = new EventPublisher(eventBus, new MongoEventStore(balanceEventCollection));
    const cardEventPublisher = new EventPublisher(eventBus, new MongoEventStore(cardEventCollection));
    const balanceMapper = new BalanceMapper();
    const cardMapper = new CardMapper();

    // repositories
    const balanceRepository = new BalanceRepository(balanceMapper);
    const cardRepository = new CardRepository(cardMapper);

    // services
    const userServiceClient = new UserServiceClient('localhost:3000', grpc.credentials.createInsecure());
    const userService = new UserService(userServiceClient);

    // controllers
    const balanceController = new BalanceController(queryBus);
    const cardController = new CardController(commandBus, queryBus);

    queryBus.registerQuery(new ListCardsQueryHandler(cardRepository));
    queryBus.registerQuery(new RetrieveBalanceQueryHandler(balanceRepository));
    commandBus.registerHandler(new CreateUserCardCommandHandler(cardEventPublisher, cardRepository, userService));
    await Promise.all([
      new UserCreatedEventHandler(balanceEventPublisher),
      new UserDeletedEventHandler(balanceEventPublisher, balanceRepository),
      new BalanceCreatedEventHandler(balanceRepository),
      new BalanceDeletedEventHandler(balanceRepository),
      new CardCreatedEventHandler(cardRepository),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`billing.${event.event.event}`, event)),
    );
    app.server.addService(BillingServiceService, {
      retrieveBalance: rpcController(balanceController.retrieveBalance.bind(balanceController)),
      createCard: rpcController(cardController.create.bind(cardController)),
      listCard: rpcController(cardController.list.bind(cardController)),
    })
    app.start();
  } catch (err) {
    app.logger.error(err);
    process.exit(1);
  }

};
start();
