import { App } from 'core';
import { commandDb, viewDb } from './lib';
import { initUser, initEvent } from './models';
import { UserController } from './controllers';

const start = async () => {
  const app = new App();
  try {
    await Promise.all([
      commandDb.connect(),
      viewDb.connect(),
    ]);
    app.server.log.info('Successfully connected to view and command databases');
    initUser();
    initEvent();

    app.server.get('/', UserController.getAll);

    await app.start();
  } catch (err) {
    app.server.log.error(err);
    process.exit(1);
  }
};
start();

