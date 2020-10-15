import { EventPublisher, ICommandHandler } from 'core';
import { Contact as ContactProto} from 'protos';
import { CreateContactRollbackCommand } from '../impl';
import { Contact } from '../../models';
import { ContactRepository } from '../../repositories';

export class CreateContactRollbackCommandHandler implements ICommandHandler<ContactProto> {
  public command = CreateContactRollbackCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
    private readonly _contactRepository: ContactRepository,
  ) {}
  public async execute(command: CreateContactRollbackCommand) {
    const contactDto = await this._contactRepository.retrieveByUser(command.idUser);
    if (!contactDto) {
      return;
    }
    const contact = this._eventPublisher.mergeObjectContext(
      new Contact(contactDto),
    );
    await contact.createRollback();
    return contact.contact;
  }
}
