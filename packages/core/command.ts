import { ICommand } from './interfaces';
import { v4 } from 'uuid';

export abstract class Command implements ICommand {
  abstract command;
  public id: string;

  protected constructor() {
    this.id = v4();
  }

  public abstract toJson(): string;
}
