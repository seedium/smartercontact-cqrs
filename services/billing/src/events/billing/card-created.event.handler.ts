import { IEventHandler } from 'core';
import { CardCreatedEvent } from '@sc/events';
import { CardRepository } from '../../repositories';

export class CardCreatedEventHandler implements IEventHandler {
  event = CardCreatedEvent;
  constructor(
    private readonly _cardRepository: CardRepository,
  ) {}
  public async handle(event: CardCreatedEvent) {
    await this._cardRepository.create(event.card);
  }
}
