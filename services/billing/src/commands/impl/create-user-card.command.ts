import { Command } from 'core';
import type { Card } from 'protos/billing/entities/card.entity_pb';

export class CreateUserCardCommand extends Command {
  constructor(
    public readonly idUser: string,
    public readonly card: Card,
  ) {
    super();
  }
}
