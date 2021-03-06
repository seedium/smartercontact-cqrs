import { EventPublisher, ICommandHandler } from 'core';
import { Card as CardProto } from 'protos';
import { CreateUserCardCommand } from '../impl';
import { CardRepository } from '../../repositories';
import { Card } from '../../models';
import { UserService } from '../../services';

export class CreateUserCardCommandHandler implements ICommandHandler<CardProto> {
  public command = CreateUserCardCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _cardRepository: CardRepository,
    private readonly _userService: UserService,
  ) {
  }
  public async execute({ card, idUser }: CreateUserCardCommand) {
    const user = await this._userService.retrieveUser(idUser);
    if (!user) {
      throw new Error('User does not exists');
    }
    const isCardExists = await this._cardRepository.isCardNumberExists(card.getCardNumber());
    if (isCardExists) {
      throw new Error('Card already exists');
    }
    card.setUser(idUser);
    const cardAggregate: Card = this._eventPublisher.mergeObjectContext(
      new Card(card),
    );
    await cardAggregate.create();
    return cardAggregate.card;
  }
  public async onFail({ card, idUser }: CreateUserCardCommand) {
    card.setUser(idUser);
    const cardAggregate = this._eventPublisher.mergeObjectContext(
      new Card(card),
    );
    await cardAggregate.createFail();
  }
}
