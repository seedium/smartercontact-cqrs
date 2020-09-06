import { MongoClient } from 'mongodb';

export const createMongoConnection = (url: string): MongoClient => {
  return new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
