import fastify, { FastifyInstance } from 'fastify';
import * as pino from 'pino';

export class App {
  private readonly _app: FastifyInstance;
  get server(): FastifyInstance {
    return this._app;
  }
  constructor() {
    this._app = fastify({
      logger: pino({
        enabled: true,
        prettyPrint: true,
      }),
    });
  }
  public async start() {
    try {
      const port: number = process.env.PORT ? +process.env.PORT : 3000;
      await this.server.listen(port);
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}
