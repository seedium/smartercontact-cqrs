import { App } from 'core';

const app = new App();
app.start();

app.server.get('/', async function get() {
  return {
    success: true,
  }
});
