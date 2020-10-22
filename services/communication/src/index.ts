import { CommandBus, EventBus, EventPublisher, MongoEventStore, RpcApp, rpcController } from 'core';
import { ContactMapper } from 'mappers';
import { CommunicationServiceService } from 'protos';
import { commandDb, viewDb } from './lib';
import {
  SendEmailCommandHandler,
  CreateContactCommandHandler,
  CreateContactRollbackCommandHandler,
} from './commands/handlers';
import {
  UserCreatedEventHandler,
  UserCreatedFailEventHandler,
  BalanceCreatedEventHandler,
  ContactCreatedEventHandler,
  ContactCreatedFailEventHandler,
  CampaignCompletedEventHandler,
} from './events';
import { BalanceSaga, CampaignSaga, UserSaga } from './sagas';
import { EmailService, TemplateEngineService } from './services';
import { NodemailerDriver } from './drivers';
import { ContactRepository } from './repositories';
import { EmailController } from './controllers';

const start = async () => {
  const app = new RpcApp();
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
    const campaignSaga = new CampaignSaga();
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
      new CampaignCompletedEventHandler(),
    ].map(
      (event) =>
        eventBus.registerEventHandler(`communication`, event),
    ));
    eventBus.registerSaga(userSaga.userCreatedSendEmail);
    eventBus.registerSaga(userSaga.userCreatedCreateContact);
    eventBus.registerSaga(userSaga.userCreatedFail);
    eventBus.registerSaga(userSaga.userCreatedRollback);
    eventBus.registerSaga(balanceSaga.balanceCreated);
    eventBus.registerSaga(campaignSaga.campaignCompleted);

    // controllers
    const emailController = new EmailController(commandBus);

    app.server.addService(CommunicationServiceService, {
      sendEmailToContact: rpcController(emailController.sendEmailToContact.bind(emailController)),
    });
    app.start();
  } catch (err) {
    app.logger.error(err);
    process.exit(1);
  }
};
start();
