import { App } from 'core';

const app = new App();
app.server.get('/', async function get() {
  return {
    success: true,
  }
});
app.start();
