import { CommandBus, EventBus, EventPublisher, MongoEventStore } from 'core';
import { ContactMapper } from 'mappers';
import { commandDb, viewDb } from './lib';
import { SendEmailCommandHandler, CreateContactCommandHandler, CreateContactRollbackCommandHandler } from './commands/handlers';
import {
  UserCreatedEventHandler,
  UserCreatedFailEventHandler,
  BalanceCreatedEventHandler,
  ContactCreatedEventHandler,
  ContactCreatedFailEventHandler,
} from './events';
import { BalanceSaga, UserSaga } from './sagas';
import { EmailService, TemplateEngineService } from './services';
import { NodemailerDriver } from './drivers';
import { ContactRepository } from './repositories';

const start = async () => {
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);
    const emailEventCollection = commandDb
      .db('cqrs_command_communication')
      .collection('email_events');
    const contactEventCollection = commandDb
      .db('cqrs_command_communication')
      .collection('contact_events');
    const commandBus = new CommandBus();
    const eventBus = new EventBus(commandBus);
    const userSaga = new UserSaga();
    const balanceSaga = new BalanceSaga();
    const emailEventPublisher = new EventPublisher(eventBus, new MongoEventStore(emailEventCollection));
    const contactEventPublisher = new EventPublisher(eventBus, new MongoEventStore(contactEventCollection));

    // mappers
    const contactMapper = new ContactMapper();

    // repositories
    const contactRepository = new ContactRepository(contactMapper);

    // services
    const templateEngineService = new TemplateEngineService();
    const nodemailerDriver = new NodemailerDriver();
    const emailService = new EmailService(templateEngineService, nodemailerDriver);

    commandBus.registerHandler(new SendEmailCommandHandler(emailEventPublisher, emailService));
    commandBus.registerHandler(new CreateContactCommandHandler(contactEventPublisher))
    commandBus.registerHandler(new CreateContactRollbackCommandHandler(contactEventPublisher, contactRepository));
    await Promise.all([
      new UserCreatedEventHandler(),
      new UserCreatedFailEventHandler(),
      new BalanceCreatedEventHandler(),
      new ContactCreatedEventHandler(contactRepository, contactEventPublisher),
      new ContactCreatedFailEventHandler(contactRepository, contactEventPublisher),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`communication`, event),
    ));
    eventBus.registerSaga(userSaga.userCreatedSendEmail);
    eventBus.registerSaga(userSaga.userCreatedCreateContact);
    eventBus.registerSaga(userSaga.userCreatedFail);
    eventBus.registerSaga(userSaga.userCreatedRollback);
    eventBus.registerSaga(balanceSaga.balanceCreated);

    console.log('Communication consumers are started');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
