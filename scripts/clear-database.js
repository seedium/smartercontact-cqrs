const runCommand = require('../tools/run-command');

class MongoExec {
  constructor(service) {
    this.service = service;
  }
  async exec(command, db) {
    await runCommand(`docker exec cqrs_${this.service}_mongo0 mongo --eval "${command}" ${db}`);
  }
  async removeCollection(db, collection) {
    await this.exec(`db.${collection}.deleteMany({})`, db);
  }
}

const clearUserService = async () => {
  const userMongoExec = new MongoExec('user');
  await userMongoExec.removeCollection('cqrs_command', 'user_events');
  await userMongoExec.removeCollection('cqrs_view', 'users');
};
const clearBillingService = async () => {
  const billingMongoExec = new MongoExec('billing');
  await billingMongoExec.removeCollection('cqrs_command', 'balance_events');
  await billingMongoExec.removeCollection('cqrs_command', 'card_events');
  await billingMongoExec.removeCollection('cqrs_view', 'cards');
  await billingMongoExec.removeCollection('cqrs_view', 'balances');
};
const clearCommunicationService = async () => {
  const communicationMongoExec = new MongoExec('user');
  await communicationMongoExec.removeCollection('cqrs_command_communication', 'email_events');
  await communicationMongoExec.removeCollection('cqrs_command_communication', 'contact_events');
  await communicationMongoExec.removeCollection('cqrs_view_communication', 'contacts');
};

const clearDatabase = async () => {
  await clearUserService();
  await clearBillingService();
  await clearCommunicationService();
};
clearDatabase();
