import { Collection } from 'mongodb';
import { Contact } from 'protos';
import { ContactMapper } from 'mappers';
import { viewDb } from '../lib';

export class ContactRepository {
  private _collection: Collection;
  constructor(
    private readonly _contactMapper: ContactMapper,
  ) {
    this._collection = viewDb.db('cqrs_view_communication').collection('contacts');
  }
  public async create(contact: Contact): Promise<Contact> {
    const contactDto = this._contactMapper.toObject(contact);
    const result = await this._collection.insertOne(contactDto);
    return this._contactMapper.fromObject(result.ops[0]);
  }
  public async retrieve(idContact: string): Promise<Contact | null> {
    const result = await this._collection.findOne({ id: idContact });
    if (!result) {
      return null;
    }
    return this._contactMapper.fromObject(result);
  }
  public async retrieveByUser(idUser: string): Promise<Contact | null> {
    const result = await this._collection.findOne({ user: idUser });
    if (!result) {
      return null;
    }
    return this._contactMapper.fromObject(result);
  }
  public async delete(idContact: string): Promise<void> {
    await this._collection.deleteOne({ id: idContact });
  }
  public async deleteByUser(idUser: string): Promise<void> {
    await this._collection.deleteOne({ user: idUser });
  }
}
