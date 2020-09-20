import { ICommand } from './interfaces';
import { v4 } from 'uuid';

export abstract class Command implements ICommand {
  public id: string;

  protected constructor() {
    this.id = v4();
  }
}
