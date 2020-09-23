import { Command } from 'core';
import type { Card } from 'protos';

export class CreateUserCardCommand extends Command {
  constructor(
    public readonly idUser: string,
    public readonly card: Card,
  ) {
    super();
  }
}
