import { commandDb } from './lib';
import { CommandBus, EventBus, EventPublisher, MongoEventStore } from 'core';
import { SendEmailCommandHandler } from './commands/handlers';
import {
  UserCreatedEventHandler,
  UserCreatedFailEventHandler,
  BalanceCreatedEventHandler,
} from './events';
import { BalanceSaga, UserSaga } from './sagas';
import { EmailService, TemplateEngineService } from './services';
import { NodemailerDriver } from './drivers';

const start = async () => {
  try {
    await Promise.all([commandDb.connect()]);
    const emailEventCollection = commandDb
      .db('cqrs_command_communication')
      .collection('communication_events');
    const commandBus = new CommandBus();
    const eventBus = new EventBus(commandBus);
    const userSaga = new UserSaga();
    const balanceSaga = new BalanceSaga();
    const emailEventPublisher = new EventPublisher(eventBus, new MongoEventStore(emailEventCollection));
    // services
    const templateEngineService = new TemplateEngineService();
    const nodemailerDriver = new NodemailerDriver();
    const emailService = new EmailService(templateEngineService, nodemailerDriver);

    commandBus.registerHandler(new SendEmailCommandHandler(emailEventPublisher, emailService));
    await Promise.all([
      new UserCreatedEventHandler(),
      new UserCreatedFailEventHandler(),
      new BalanceCreatedEventHandler(),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`communication.${event.event.event}`, event),
    ));
    eventBus.registerSaga(userSaga.userCreated);
    eventBus.registerSaga(userSaga.userCreatedFail);
    eventBus.registerSaga(balanceSaga.balanceCreated);

    console.log('Communication consumers are started');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
