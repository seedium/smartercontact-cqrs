import * as grpc from 'grpc';
import {
  CommandBus,
  EventBus,
  EventPublisher,
  MongoEventStore,
  OrchestratorBus,
  RpcApp,
  rpcController,
} from 'core';
import {
  UserServiceClient,
  CampaignServiceService,
  BillingServiceClient,
  CommunicationServiceClient,
} from 'protos';
import { CampaignMapper } from 'mappers';
import {
  CheckUserActiveCommandHandler,
  CreateCampaignCommandHandler,
  CreateCampaignRollbackCommandHandler,
  ReserveFundsCommandHandler,
  RunCampaignCommandHandler,
} from './commands/handlers';
import { CreateCampaignOrchestratorHandler } from './orchestrators/handlers';
import { BillingService, CommunicationService, UserService } from './services';
import { CampaignController } from './controllers';
import { commandDb, viewDb } from './lib';
import { CampaignRepository } from './repositories';
import { CampaignSaga } from './sagas';
import { CampaignCreatedEventHandler, CampaignCreatedFailEventHandler, CampaignCompletedEventHandler } from './events/campaign';

const start = async () => {
  const app = new RpcApp();
  try {
    await Promise.all([
      viewDb.connect(),
      commandDb.connect(),
    ]);
    const commandBus = new CommandBus();
    const orchestratorBus = new OrchestratorBus(commandBus);
    const eventBus = new EventBus(commandBus);
    const campaignEventCollection = commandDb.db('cqrs_command_campaign').collection('campaign_events');
    const campaignEventPublisher = new EventPublisher(eventBus, new MongoEventStore(campaignEventCollection));

    // grcp clients
    const userServiceClient = new UserServiceClient('localhost:3000', grpc.credentials.createInsecure());
    const billingServiceClient = new BillingServiceClient('localhost:3005', grpc.credentials.createInsecure());
    const communicationClient = new CommunicationServiceClient('localhost:3002', grpc.credentials.createInsecure());

    // services
    const userService = new UserService(userServiceClient);
    const billingService = new BillingService(billingServiceClient);
    const communicationService = new CommunicationService(communicationClient);

    // repositories
    const campaignMapper = new CampaignMapper();
    const campaignRepository = new CampaignRepository(campaignMapper);

    // commands
    commandBus.registerHandler(new CheckUserActiveCommandHandler(userService));
    commandBus.registerHandler(new CreateCampaignCommandHandler(campaignEventPublisher, campaignRepository));
    commandBus.registerHandler(new CreateCampaignRollbackCommandHandler(campaignEventPublisher, campaignRepository));
    commandBus.registerHandler(new ReserveFundsCommandHandler(billingService));
    commandBus.registerHandler(new RunCampaignCommandHandler(campaignEventPublisher, communicationService));

    // orchestration
    orchestratorBus.registerOrchestrator(new CreateCampaignOrchestratorHandler());

    // events
    await Promise.all([
      new CampaignCreatedEventHandler(campaignEventPublisher, campaignRepository),
      new CampaignCreatedFailEventHandler(campaignRepository),
      new CampaignCompletedEventHandler(campaignRepository),
    ].map(
      (event) => eventBus.registerEventHandler('campaign', event)),
    );

    // sagas
    const campaignSaga = new CampaignSaga();
    eventBus.registerSaga(campaignSaga.createFail);

    // controllers
    const campaignController = new CampaignController(orchestratorBus);

    app.server.addService(CampaignServiceService, {
      createCampaign: rpcController(campaignController.create.bind(campaignController)),
    });
    app.start();
  } catch (err) {
    app.logger.error(err);
    process.exit(1);
  }
};
start();
