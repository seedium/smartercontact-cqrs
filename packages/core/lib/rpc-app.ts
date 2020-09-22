import * as grpc from 'grpc';
import * as pino from 'pino';

export class RpcApp {
  private readonly _app: grpc.Server;
  private readonly _logger: pino.Logger = pino();
  get server(): grpc.Server {
    return this._app;
  }
  get logger(): pino.Logger {
    return this._logger;
  }
  constructor() {
    this._app = new grpc.Server();
  }
  public start() {
    try {
      const port: number = process.env.PORT ? +process.env.PORT : 3000;
      const address = `0.0.0.0:${port}`;
      this._app.bind(address, grpc.ServerCredentials.createInsecure());
      this.server.start();
      this.logger.info(`Server is started on address "${address}"`);
    } catch (err) {
      this.logger.error(err);
      process.exit(1);
    }
  }
}
