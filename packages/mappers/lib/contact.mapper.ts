import { DataMapper } from 'core';
import { Contact } from 'protos/communication/entities/contact.entity_pb';
import type { Contact as ContactDto } from 'protos/communication/entities/contact.entity_pb';

export class ContactMapper extends DataMapper<Contact, ContactDto.AsObject> {
  public readonly map = {
    Id: 'id',
    Created: 'created',
    User: 'user',
    TypesList: 'types',
  };
  public readonly entity = Contact;
}
