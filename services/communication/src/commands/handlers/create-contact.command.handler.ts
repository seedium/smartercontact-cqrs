import { EventPublisher, ICommandHandler } from 'core';
import { Contact as ContactProto} from 'protos';
import { CreateContactCommand } from '../impl';
import { Contact } from '../../models';

export class CreateContactCommandHandler implements ICommandHandler<ContactProto> {
  public command = CreateContactCommand;
  constructor(
    private readonly _eventPublisher: EventPublisher,
  ) {}
  public async execute(command: CreateContactCommand) {
    const contactDto = this.createContactDto(command.idUser);
    const contact = this._eventPublisher.mergeObjectContext(
      new Contact(contactDto),
    );
    await contact.create();
    return contact.contact;
  }
  public async onFail(command: CreateContactCommand) {
    const contactDto = this.createContactDto(command.idUser);
    const contact = this._eventPublisher.mergeObjectContext(
      new Contact(contactDto),
    );
    await contact.createFail();
  }
  private createContactDto(idUser: string): ContactProto {
    const contact = new ContactProto();
    contact.setCreated(Date.now());
    contact.setTypesList(['news', 'events', 'updates']);
    contact.setUser(idUser);
    return contact;
  }
}
