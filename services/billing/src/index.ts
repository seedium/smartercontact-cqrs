import { App, CommandBus, EventPublisher, EventBus, QueryBus } from 'core';
import { commandDb, viewDb } from './lib';
import { BalanceController, CardController } from './controllers';
import { BalanceRepository, CardRepository } from './repositories';
import { ListCardsQueryHandler, RetrieveBalanceQueryHandler } from './queries/handlers';
import { BalanceCreatedEventHandler, BalanceDeletedEventHandler } from './events/billing/handlers';
import { UserCreatedEventHandler, UserDeletedEventHandler } from './events/user/handlers';

const start = async () => {
  const app = new App();
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    const eventBus = new EventBus();
    const eventPublisher = new EventPublisher(eventBus);

    // repositories
    const balanceRepository = new BalanceRepository();
    const cardRepository = new CardRepository();

    // controllers
    const balanceController = new BalanceController(queryBus);
    const cardController = new CardController(queryBus);

    queryBus.registerQuery(new ListCardsQueryHandler(cardRepository));
    queryBus.registerQuery(new RetrieveBalanceQueryHandler(balanceRepository));
    await Promise.all([
      new UserCreatedEventHandler(eventPublisher),
      new UserDeletedEventHandler(eventPublisher, balanceRepository),
      new BalanceCreatedEventHandler(balanceRepository),
      new BalanceDeletedEventHandler(balanceRepository)
    ].map(
      (event) =>
        eventBus.registerEventHandler(`billing.${event.event.event}`, event)),
    );

    app.server.get('/users/:idUser/cards', cardController.list.bind(cardController));
    app.server.get('/users/:idUser/balance', balanceController.getBalance.bind(balanceController));

    await app.start();
  } catch (err) {
    app.server.log.error(err);
    process.exit(1);
  }

};
start();
